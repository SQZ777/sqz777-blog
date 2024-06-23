CREATE SCHEMA test1_db_schema AUTHORIZATION postgres;


-- test1_db_schema.test1_table definition

-- Drop table

-- DROP TABLE test1_db_schema.test1_table;

CREATE TABLE test1_db_schema.test1_table (
	id varchar(10) NOT NULL,
	another_column varchar(50) NOT NULL
)
