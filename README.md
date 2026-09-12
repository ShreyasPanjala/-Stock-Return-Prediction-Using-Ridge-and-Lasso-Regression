# AI-Driven Stock Return Prediction Using Ridge and Lasso Regression

A machine learning project for predicting future stock returns using financial feature engineering, feature scaling, and regularized linear regression models.

## 📌 Project Overview

Stock market returns are highly volatile and difficult to predict accurately. This project explores whether historical market information and engineered financial indicators can be used to predict the future return of a stock.

The project focuses on **Ridge Regression** and **Lasso Regression**, two regularized linear regression techniques that help control model complexity and reduce the risk of overfitting.

The current implementation uses historical **Apple Inc. (AAPL)** stock data collected using `yfinance`.

The prediction target is **Future Return**, representing the percentage change in the stock's closing price over the following five trading days.

---

## 🎯 Objectives

- Collect historical stock market data.
- Perform financial feature engineering.
- Create technical and historical return-based features.
- Apply feature scaling before model training.
- Train Ridge and Lasso Regression models.
- Tune the regularization parameter using time-series cross-validation.
- Compare model performance against a simple baseline.
- Analyze the coefficients selected by Ridge and Lasso.
- Evaluate the models using MAE, RMSE, and R².
- Develop a Streamlit dashboard for predictions and visualization.

---

## 🧠 Machine Learning Approach

The project follows this pipeline:

```text
Historical Stock Data
        ↓
Data Collection
        ↓
Feature Engineering
        ↓
Data Preprocessing
        ↓
Feature Scaling
        ↓
Ridge Regression + Lasso Regression
        ↓
Hyperparameter Tuning
        ↓
Model Evaluation
        ↓
Prediction Dashboard
