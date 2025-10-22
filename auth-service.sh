#!/bin/bash

cd services/auth-service
source venv/bin/activate
uvicorn app.main:app --reload --port 8001