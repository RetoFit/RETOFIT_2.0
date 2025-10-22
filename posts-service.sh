#!/bin/bash

cd services/posts-service
npx prisma generate
npm run dev