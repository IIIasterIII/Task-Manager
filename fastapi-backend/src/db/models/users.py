from typing import Annotated
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Column, String, DateTime
from sqlalchemy import String, INTEGER

intpk = Annotated[int, mapped_column(primary_key=True)]

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


class IssuedToken(Base):
    __tablename__ = "issued_tokens"

    token = Column(String(255), primary_key=True)
    email_id = Column(String(255), index=True)
    session_id = Column(String(255))