from sqlalchemy import select
from fastapi import APIRouter, Depends, status, HTTPException
from typing import List, Annotated
from ..db.session import SessionDep

