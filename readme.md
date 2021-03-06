Cassandra bulk insert tool.

Generates as much data as required to test schemas/queries against a cassandra database.

## Usage:
	node.js index.js <number of rows to insert>

## Configuration:
Configuration is taken for the config/config.json file.

CassandraConfig, check https://github.com/datastax/nodejs-driver for the possible values to initialize the cassandra client.

Tables, array of tables to insert the generated rows, both tables have to share the same columns but can have different indexes.

Schema: object which contains all the schema columns and possible values to generated for them.

Possible options: 

	- value: will assign as specified value for a column
		"test": { "value": 1 } // Will always assign the value 1 to the column test.

	- values: will randomly assign any of the specified array of values to a column
		"test": { "values": ["1", "2"] } // Will assign randomly 1 or 2 to the column test.

	- feature:
		* Cassandra: will generate the type specified in the type property, only works for uuid and timeuuid.
			"test": { "feature": "Cassandra", "type": "uuid" } // generates an uui for the column test.
			"test": { "feature": "Cassandra", "type": "timeuuid" } //generates a timeuuid for the column test. 
		
		
Other options can be check in https://github.com/Marak/faker.js

The sample config.json generates rows for the following tables:

CREATE TABLE demo.timeline (
    day text,
    hour int,
    min int,
    id uuid,
    recenttime timestamp,
    futuretime timestamp,
    multiplevalues text,
    PRIMARY KEY (day, hour, min, id)
);

CREATE TABLE demo.timelinebyrecenttime (
    day text,
    hour int,
    min int,
    id uuid,
    recenttime timestamp,
    futuretime timestamp,
    multiplevalues text,
    PRIMARY KEY (day, hour, min, recenttime)
);
