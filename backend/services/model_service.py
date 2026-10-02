import os
import joblib
import pandas as pd
import numpy as np
from backend.ml.features import generate_features

MODEL_DIR = "models"
OUTPUT_DIR = "outputs"

def load_models():
    if not (os.path.exists(f"{MODEL_DIR}/ridge_model.pkl") and os.path.exists(f"{MODEL_DIR}/lasso_model.pkl")):
        raise FileNotFoundError("Models not found. Please train the models first.")
        
    ridge = joblib.load(f"{MODEL_DIR}/ridge_model.pkl")
    lasso = joblib.load(f"{MODEL_DIR}/lasso_model.pkl")
    scaler = joblib.load(f"{MODEL_DIR}/scaler.pkl")
    feature_names = joblib.load(f"{MODEL_DIR}/feature_names.pkl")
    return ridge, lasso, scaler, feature_names

def get_coefficients():
    try:
        ridge, lasso, _, feature_names = load_models()
        
        # Format coefficients for frontend (top 15 absolute magnitude)
        def process_coefs(model):
            coefs = pd.Series(model.coef_, index=feature_names)
            top_features = coefs.abs().sort_values(ascending=False).head(15).index
            # Sort by actual value for plotting
            sorted_coefs = coefs[top_features].sort_values()
            return sorted_coefs.to_dict()
            
        return {
            "ridge": process_coefs(ridge),
            "lasso": process_coefs(lasso)
        }
    except Exception as e:
        return {}

def get_performance_metrics():
    try:
        if os.path.exists(f"{OUTPUT_DIR}/model_comparison.csv"):
            metrics_df = pd.read_csv(f"{OUTPUT_DIR}/model_comparison.csv")
            ridge_metrics = metrics_df[metrics_df['Model'] == 'Ridge Regression'].iloc[0].to_dict()
            lasso_metrics = metrics_df[metrics_df['Model'] == 'Lasso Regression'].iloc[0].to_dict()
            
            # Map column names if needed
            return {
                "ridge": {
                    "r2": ridge_metrics.get("R2 Score", 0),
                    "mae": ridge_metrics.get("MAE", 0),
                    "rmse": ridge_metrics.get("RMSE", 0)
                },
                "lasso": {
                    "r2": lasso_metrics.get("R2 Score", 0),
                    "mae": lasso_metrics.get("MAE", 0),
                    "rmse": lasso_metrics.get("RMSE", 0)
                }
            }
    except Exception:
        pass
    return {}

def make_prediction(data: pd.DataFrame):
    ridge, lasso, scaler, feature_names = load_models()
    
    featured_data = generate_features(data)
    latest_data = featured_data.iloc[-1:]
    
    # Check if we have NaN in required features
    if latest_data[feature_names].isnull().values.any():
        # Fill NA with forward fill or 0 just to prevent failure, though if history is long enough, shouldn't happen.
        latest_data = latest_data.fillna(method="ffill").fillna(0)
        
    X_latest = latest_data[feature_names]
    X_scaled = scaler.transform(X_latest)
    
    ridge_log_return = ridge.predict(X_scaled)[0]
    lasso_log_return = lasso.predict(X_scaled)[0]
    
    latest_close = data['Close'].iloc[-1]
    
    # Calculate percentage return correctly from log return
    ridge_ret_pct = float(np.exp(ridge_log_return) - 1)
    lasso_ret_pct = float(np.exp(lasso_log_return) - 1)
    
    # Implied price
    predicted_ridge_price = float(latest_close * np.exp(ridge_log_return))
    predicted_lasso_price = float(latest_close * np.exp(lasso_log_return))
    
    ridge_price_change = float(predicted_ridge_price - latest_close)
    lasso_price_change = float(predicted_lasso_price - latest_close)
    
    return {
        "ridge": {
            "predicted_return": ridge_ret_pct,
            "predicted_price": predicted_ridge_price,
            "price_change": ridge_price_change
        },
        "lasso": {
            "predicted_return": lasso_ret_pct,
            "predicted_price": predicted_lasso_price,
            "price_change": lasso_price_change
        }
    }
