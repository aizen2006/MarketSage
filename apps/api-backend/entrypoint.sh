#!/bin/bash
set -e

cd /app/packages/db
bunx prisma migrate deploy

cd /app/apps/api-backend
exec bun start

