#!/bin/bash
echo "Starting PostgreSQL..."

/usr/local/bin/docker-entrypoint.sh postgres & # 將 postgres 啟動

until pg_isready -h localhost -p 5432; do # 檢查 postgres 啟動狀態
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

# psql -U postgres -c "CREATE DATABASE test1;"
psql -U postgres -c "CREATE DATABASE test2;"


psql -U postgres -d test1 -a -f /test1.sql
psql -U postgres -d test2 -a -f /test2.sql
psql -U postgres -d test2 -c "REFRESH MATERIALIZED VIEW test2_db_schema.test2_mv"

tail -f /dev/null # 讓 container 保持運作狀態