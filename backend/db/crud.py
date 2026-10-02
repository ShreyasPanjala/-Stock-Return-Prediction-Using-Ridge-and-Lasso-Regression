from sqlalchemy.orm import Session
from backend.db import models
from datetime import datetime

def create_search_history(
    db: Session, 
    ticker: str, 
    company_name: str, 
    start_date: str, 
    end_date: str, 
    predicted_return_ridge: float, 
    predicted_return_lasso: float
):
    db_history = models.SearchHistory(
        ticker=ticker,
        company_name=company_name,
        start_date=start_date,
        end_date=end_date,
        predicted_return_ridge=predicted_return_ridge,
        predicted_return_lasso=predicted_return_lasso
    )
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history

def get_recent_history(db: Session, limit: int = 10):
    return db.query(models.SearchHistory).order_by(models.SearchHistory.timestamp.desc()).limit(limit).all()
