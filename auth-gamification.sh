#!/bin/bash

cd services/gamification-service
source venv/bin/activate
uvicorn app.main:app --reload --port 8003