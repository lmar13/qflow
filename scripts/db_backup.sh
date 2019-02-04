#!/bin/sh
DATABASE="qflow"
NOW=$(date +"%m_%d_%Y")
# PATH=`/db_backups`
# mongodump --archive='$DATABASE.$NOW.gz' --gzip --db $DATABASE -o $PATH