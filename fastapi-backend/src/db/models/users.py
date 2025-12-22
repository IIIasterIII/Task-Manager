from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, String, DateTime, Boolean, Date, Time, Enum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from sqlalchemy import String, INTEGER
from datetime import date, time, datetime
from typing import Optional, List
import enum

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id = Column(INTEGER, primary_key=True, autoincrement=True, index=True)
    email = Column(String(248), unique=True, index=True, nullable=False)
    username = Column(String(50))
    user_pic = Column(String(512))
    first_logged_in = Column(DateTime)
    last_accessed = Column(DateTime)
    profile: Mapped["Profile"] = relationship(back_populates="user")
    tasks: Mapped[list["Task"]] = relationship(back_populates="user")
    projects: Mapped[list["Project"]] = relationship(back_populates="user")
    labels: Mapped[List["Label"]] = relationship(back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="profile")

class ProjectTasks(Base):
    __tablename__ = "project_tasks"
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), primary_key=True)
    added_at: Mapped[datetime] = mapped_column(server_default=func.now())
    task: Mapped["Task"] = relationship(back_populates="task_links")
    project: Mapped["Project"] = relationship(back_populates="project_links")

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(252), nullable=False, unique=True)
    color: Mapped[str] = mapped_column(String(256), nullable=False)
    favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("projects.id"), nullable=True)
    user: Mapped["User"] = relationship(back_populates="projects")
    parent: Mapped[Optional["Project"]] = relationship("Project", remote_side=[id], back_populates="sub_projects" )
    sub_projects: Mapped[List["Project"]] = relationship( "Project", back_populates="parent", cascade="all, delete-orphan")
    project_links: Mapped[List["ProjectTasks"]] = relationship(back_populates="project")

class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Label(Base):
    __tablename__ = "labels"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    color: Mapped[str] = mapped_column(String(7), default="#ffffff")
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="labels")  
    label_links: Mapped[List["TaskLabel"]] = relationship(back_populates="label")  

class TaskLabel(Base):
    __tablename__ = "task_labels"
    label_id: Mapped[int] = mapped_column(ForeignKey("labels.id"), primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), primary_key=True)
    added_at = Column(DateTime)
    label: Mapped["Label"] = relationship(back_populates="label_links")
    task: Mapped["Task"] = relationship(back_populates="task_label_links")

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(String(512))
    date_at: Mapped[Optional[date]] = mapped_column(Date)
    time_at: Mapped[Optional[time]] = mapped_column(Time)
    priority: Mapped[TaskPriority] = mapped_column(Enum(TaskPriority), default=TaskPriority.LOW)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="tasks")
    task_label_links: Mapped[List["TaskLabel"]] = relationship(back_populates="task")
    task_links: Mapped[List["ProjectTasks"]] = relationship(back_populates="task")