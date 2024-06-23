CREATE SCHEMA test2_db_schema AUTHORIZATION postgres;

CREATE EXTENSION postgres_fdw;

CREATE SERVER test1_db
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS (host 'localhost', port '5432', dbname 'test1');

CREATE USER MAPPING FOR postgres
SERVER test1_db
OPTIONS (user 'postgres', password '12345');

-- test2_db_schema.test1_table definition

-- Drop table

-- DROP FOREIGN TABLE test2_db_schema.test1_table;

CREATE FOREIGN TABLE test2_db_schema.test1_table (
	id varchar(10) NOT NULL,
	another_column varchar(50) NOT NULL
)
SERVER test1_db
OPTIONS (schema_name 'test1_db_schema', table_name 'test1_table');

-- Permissions

ALTER TABLE test2_db_schema.test1_table OWNER TO postgres;
GRANT ALL ON TABLE test2_db_schema.test1_table TO postgres;

CREATE MATERIALIZED VIEW test2_db_schema.test2_mv
TABLESPACE pg_default
AS SELECT t.id,
    t.another_column
   FROM test2_db_schema.test1_table t
WITH NO DATA;

-- View indexes:
CREATE UNIQUE INDEX uix_test2_mv ON test2_db_schema.test2_mv USING btree (cupid_id, outer_id);

-- Permissions
ALTER TABLE test2_db_schema.test2_mv OWNER TO postgres;
GRANT ALL ON TABLE test2_db_schema.test2_mv TO postgres;