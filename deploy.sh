#!/bin/sh

cd ~/ra-frontend;
git pull;
docker-compose -f docker-compose.prod.yml build --no-cache && docker-compose -f docker-compose.prod.yml down && docker system prune -f &&  docker-compose -f docker-compose.prod.yml up --force-recreate -d;
