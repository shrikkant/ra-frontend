#!/bin/sh

cd ~/ra-frontend;
git pull -4;
docker compose -f docker-compose.prod.yml build && docker compose -f docker-compose.prod.yml down && docker system prune -f &&  docker compose -f docker-compose.prod.yml up --force-recreate -d;
