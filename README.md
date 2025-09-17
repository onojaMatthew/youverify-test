## To access the database in command line

run: `docker exec -it customer-db mongosh`

## To switch to a particular database
run: `use database_name`

## To see the databases in the connection
run: `show databases`

## To see the tables in the database
run: `show tables`

## To see the data in a particular table
run: `db.collection_name.find({})`