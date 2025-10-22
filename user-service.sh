#!/bin/bash

cd services/user-service
source venv/bin/activate
uvicorn app.main:app --reload --port 8004