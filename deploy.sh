#!/bin/bash

COMPOSE_FILE=${1:-docker-compose.yaml}

git pull
docker compose -f "$COMPOSE_FILE" down
docker compose -f "$COMPOSE_FILE" build
docker compose -f "$COMPOSE_FILE" up -d
