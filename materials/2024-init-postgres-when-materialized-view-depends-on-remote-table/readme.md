docker build . -t test-postgres
docker run -dp 5432:5432 -t test-postgres