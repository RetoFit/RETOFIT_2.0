#!/bin/bash

./admin-service.sh &
./auth-gamification.sh &
./auth-service.sh &
./user-service.sh &
./posts-service.sh &
./front-service.sh &
./api_gateway.sh
