import joblib
import pandas as pd

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from preprocessing import prepare_data


def evaluate_models():

    print("=" * 50)
    print("MODEL EVALUATION")
    print("=" * 50)

    # Prepare test data
    (
        X_train,
        X_test,
        y_train,
        y_test,
        scaler,
        feature_names
    ) = prepare_data(
        "data/processed/featured_data.csv"
    )

    # Load trained models
    ridge = joblib.load("models/ridge_model.pkl")
    lasso = joblib.load("models/lasso_model.pkl")

    # Predictions
    ridge_predictions = ridge.predict(X_test)
    lasso_predictions = lasso.predict(X_test)

    results = []

    # Evaluate Ridge
    ridge_mae = mean_absolute_error(y_test, ridge_predictions)
    ridge_rmse = mean_squared_error(
        y_test,
        ridge_predictions
    ) ** 0.5
    ridge_r2 = r2_score(y_test, ridge_predictions)

    results.append({
        "Model": "Ridge Regression",
        "MAE": ridge_mae,
        "RMSE": ridge_rmse,
        "R2 Score": ridge_r2
    })

    # Evaluate Lasso
    lasso_mae = mean_absolute_error(y_test, lasso_predictions)
    lasso_rmse = mean_squared_error(
        y_test,
        lasso_predictions
    ) ** 0.5
    lasso_r2 = r2_score(y_test, lasso_predictions)

    results.append({
        "Model": "Lasso Regression",
        "MAE": lasso_mae,
        "RMSE": lasso_rmse,
        "R2 Score": lasso_r2
    })

    # Create results table
    results_df = pd.DataFrame(results)

    print("\nMODEL PERFORMANCE")
    print("-" * 50)
    print(results_df.to_string(index=False))

    # Save results
    results_df.to_csv(
        "outputs/model_comparison.csv",
        index=False
    )

    print("\nResults saved to:")
    print("outputs/model_comparison.csv")


if __name__ == "__main__":
    evaluate_models()