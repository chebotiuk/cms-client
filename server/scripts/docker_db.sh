#!/bin/bash
if [ "$(docker ps -a -q -f name=mongodb)" ]; then
    docker start mongodb
  else
    docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.2.1
fi
