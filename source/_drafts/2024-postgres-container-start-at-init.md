---
title: 確保 postgres 運行後再執行 init db 的方法
tags:
  - postgres
  - docker
---

一般情況下，透過 `COPY init.sh /docker-entrypoint-initdb.d/init.sh` 就可以在 postgres container 啟動前進行 init db 了
不過在遇到 A DB 有一張 B DB 的 remote table，並且需要針對 remote table 的內容產生一個 materialized view 時，在下面這個 script 會遇到問題

如下
```
FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=12345

COPY init.sh /docker-entrypoint-initdb.d/init.sh
```

init.sh:
```
psql -U postgres -c "CREATE DATABASE test1;"
psql -U postgres -c "CREATE DATABASE test2;"
```

