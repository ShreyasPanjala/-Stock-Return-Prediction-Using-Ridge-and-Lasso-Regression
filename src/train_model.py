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

    lasso_params = {
        "alpha": [0.0001, 0.001, 0.01, 0.1, 1]
    }

    lasso_grid = GridSearchCV(
        Lasso(max_iter=10000),
        lasso_params,
        cv=tscv,
        scoring="neg_mean_squared_error"
    )

    lasso_grid.fit(X_train, y_train)

    joblib.dump(ridge_grid.best_estimator_, "models/ridge_model.pkl")
    joblib.dump(lasso_grid.best_estimator_, "models/lasso_model.pkl")

    joblib.dump(scaler, "models/scaler.pkl")
    joblib.dump(feature_names.tolist(), "models/feature_names.pkl")

    print("Models trained successfully.")
    print("Best Ridge Alpha:", ridge_grid.best_params_)
    print("Best Lasso Alpha:", lasso_grid.best_params_)

    return (
        ridge_grid.best_estimator_,
        lasso_grid.best_estimator_,
        X_test,
        y_test
    )


if __name__ == "__main__":
    train_models()