import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from preprocessing import prepare_data


def evaluate_baseline():

    print("=" * 55)
    print("BASELINE MODEL")
    print("=" * 55)

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

    # Predict the mean training return
    baseline_prediction = y_train.mean()

    predictions = [baseline_prediction] * len(y_test)

    mae = mean_absolute_error(y_test, predictions)

    rmse = mean_squared_error(
        y_test,
        predictions
    ) ** 0.5

    r2 = r2_score(y_test, predictions)

    print("\nBASELINE PERFORMANCE")
    print("-" * 55)
    print(f"Mean training return: {baseline_prediction:.6f}")
    print(f"MAE:                  {mae:.6f}")
    print(f"RMSE:                 {rmse:.6f}")
    print(f"R2 Score:             {r2:.6f}")


if __name__ == "__main__":
    evaluate_baseline()