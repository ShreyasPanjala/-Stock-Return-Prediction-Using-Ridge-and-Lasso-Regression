from sqlalchemy import Column, Integer, String, Float, DateTime
from backend.db.database import Base
from datetime import datetime

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    company_name = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    predicted_return_ridge = Column(Float)
    predicted_return_lasso = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
