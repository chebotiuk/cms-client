#!/bin/bash

cd $1
git pull
docker-compose down
docker-compose -f docker-compose.prod.yml up -d --build
