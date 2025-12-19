from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, String, DateTime
from sqlalchemy import String, INTEGER

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    user_id = Column(INTEGER, primary_key=True, autoincrement=True, index=True)
    email_id = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(255))
    user_pic = Column(String(512))
    first_logged_in = Column(DateTime)
    last_accessed = Column(DateTime)