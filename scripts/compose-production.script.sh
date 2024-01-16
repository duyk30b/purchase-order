#!/bin/sh
docker-compose -f docker-compose.yml -f docker-compose.production.yml up --build -d
docker system prune --force