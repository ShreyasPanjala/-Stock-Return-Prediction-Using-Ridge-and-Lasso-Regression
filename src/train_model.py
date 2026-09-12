import os
import joblib

from sklearn.linear_model import Ridge, Lasso
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit

from preprocessing import prepare_data


def train_models():

    os.makedirs("models", exist_ok=True)

    (
        X_train,
        X_test,
        y_train,
        y_test,
        scaler,
        feature_names
    ) = prepare_data("data/processed/featured_data.csv")

    tscv = TimeSeriesSplit(n_splits=5)

    # -----------------------------
    # Ridge Regression
    # -----------------------------
    ridge_params = {
        "alpha": [0.001, 0.01, 0.1, 1, 10, 100]
    }

    ridge_grid = GridSearchCV(
        Ridge(),
        ridge_params,
        cv=tscv,
        scoring="neg_mean_squared_error"
    )

    ridge_grid.fit(X_train, y_train)

    # -----------------------------
    # Lasso Regression
    # -----------------------------
    lasso_params = {
        "alpha": [
            0.000001,
            0.000005,
            0.00001,
            0.00005,
            0.0001,
            0.0005,
            0.001
    ]
}

    lasso_grid = GridSearchCV(
        Lasso(max_iter=10000),
        lasso_params,
        cv=tscv,
        scoring="neg_mean_squared_error"
    )

    lasso_grid.fit(X_train, y_train)

    # Best models
    ridge_model = ridge_grid.best_estimator_
    lasso_model = lasso_grid.best_estimator_

    # -----------------------------
    # Save models
    # -----------------------------
    joblib.dump(ridge_model, "models/ridge_model.pkl")
    joblib.dump(lasso_model, "models/lasso_model.pkl")

    joblib.dump(scaler, "models/scaler.pkl")
    joblib.dump(feature_names.tolist(), "models/feature_names.pkl")

    # -----------------------------
    # Print results
    # -----------------------------
    print("Models trained successfully.")
    print("Best Ridge Alpha:", ridge_grid.best_params_)
    print("Best Lasso Alpha:", lasso_grid.best_params_)

    # -----------------------------
    # Lasso coefficient analysis
    # -----------------------------
    print("\nLASSO COEFFICIENT ANALYSIS")
    print("-" * 50)

    non_zero_count = 0

    for feature, coefficient in zip(
        feature_names,
        lasso_model.coef_
    ):
        if abs(coefficient) > 1e-8:
            print(f"{feature:<25} {coefficient:.8f}")
            non_zero_count += 1

    print("-" * 50)
    print(f"Total features: {len(feature_names)}")
    print(f"Non-zero Lasso features: {non_zero_count}")
    print(f"Zero Lasso features: {len(feature_names) - non_zero_count}")

    # -----------------------------
    # Ridge coefficient analysis
    # -----------------------------
    print("\nRIDGE COEFFICIENT ANALYSIS")
    print("-" * 50)

    for feature, coefficient in zip(
        feature_names,
        ridge_model.coef_
    ):
        print(f"{feature:<25} {coefficient:.8f}")

    return (
        ridge_model,
        lasso_model,
        X_test,
        y_test
    )


if __name__ == "__main__":
    train_models()