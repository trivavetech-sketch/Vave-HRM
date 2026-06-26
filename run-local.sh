#!/bin/bash

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: docker is not installed.' >&2
  exit 1
fi

# Check if Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

echo "🐳 Spin up local services (Postgres, Redis, Backend, Frontend) via Docker Compose..."

# Run Docker Compose build and start in detached mode
docker-compose -f docker/docker-compose.yml up --build -d

if [ $? -eq 0 ]; then
  echo "🚀 Vave HRM local cluster started successfully!"
  echo "--------------------------------------------------------"
  echo "  Frontend Dashboard : http://localhost:3000"
  echo "  Backend API Gateway: http://localhost:4000/api/v1"
  echo "--------------------------------------------------------"
  echo "To view logs: docker-compose -f docker/docker-compose.yml logs -f"
  echo "To stop services: docker-compose -f docker/docker-compose.yml down"
else
  echo "❌ Failed to start local services."
  exit 1
fi
