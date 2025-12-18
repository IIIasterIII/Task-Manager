from typing import Annotated
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String

intpk = Annotated[int, mapped_column(primary_key=True)]

class Base(DeclarativeBase):
    pass

class UsersOrm(Base):
    __tablename__ = "users"

    id: Mapped[intpk]
    username: Mapped[str] = mapped_column(String(256))
    password: Mapped[str] = mapped_column(String(256))
    avatar_url: Mapped[str] = mapped_column(String(256))
