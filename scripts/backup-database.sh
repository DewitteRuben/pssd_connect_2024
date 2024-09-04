#!/bin/bash

mkdir -p $HOME/dbbackups

docker compose exec database mongodump --username $MONGO_INITDB_ROOT_USERNAME \
 --password $MONGO_INITDB_ROOT_PASSWORD \
 --authenticationDatabase admin --db maindb --archive=maindb.dump

docker compose cp database:/maindb.dump $HOME/dbbackups/maindb-$(date +"%Y-%m-%dT%H:%M:%S").dump