"""Run with: python -m uvicorn main:app --reload."""

from app.application import create_app

app = create_app()
