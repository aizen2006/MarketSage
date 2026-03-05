#!/bin/bash
set -e

cd /app/packages/db
bunx prisma migrate deploy

cd /app/apps/backend
exec bun start

