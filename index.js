'use strict';

var fs = require('fs'),
	cassandra = require('cassandra-driver'),
	async = require('async'),
	items = 1,
	Faker = require('Faker');

var config = require('./config/config.json'),
	cassandraConfig = config.CassandraConfig,
	schema = config.Schema,
	tableName = config.Table,
    client = new cassandra.Client(cassandraConfig);

function GenerateValue(valueConfig) {
	var generatedValue,
		func;

	if (valueConfig.value) {
		generatedValue = valueConfig.value;
	} else if (valueConfig.values) {
		generatedValue = valueConfig.values[Math.floor(Math.random()*valueConfig.values.length)];
	} else if (valueConfig.feature == 'Cassandra') { 
		generatedValue = cassandra.types[valueConfig.type]();
	} else if (Faker[valueConfig.feature] && (func = Faker[valueConfig.feature][valueConfig.type])) {
		generatedValue = func.apply(this,valueConfig.parameters);
	} else {
		console.log('Invalid schema parameter');
		process.exit(0);
	}

	var type = typeof generatedValue;
	if (type === 'number') {
		return generatedValue;
	} else {
		var date = Date.parse(generatedValue);
		if (!isNaN(date)) {
			return date
		} else {
			return "'" + generatedValue + "'";
		}
	}
}

function InsertRandomRow(callback) {
	var data = "",
		values = "",
		cql = "INSERT INTO " + tableName + " (";
	for (var key in schema) {
		if (values != "") {
			values += ", ";
			data += ", ";
		}
		values += key;

		data += GenerateValue(schema[key]);
	}

	cql += values + ") VALUES (" + data + ")";
	client.execute(cql, [], function (err, result) {
		callback(err, result);
	});
}

if (process.argv.length > 1 && !isNaN(process.argv[2]))
	items = process.argv[2];

var tasks = [],
    startDate = new Date();

for(var i=0;i<items;i++) {
	tasks.push(function(callback) {
		InsertRandomRow(callback);
	});
}

async.series(tasks, function(err, result) {
	var elapsedMs = new Date() - startDate;
	console.log(result.length + ' rows sucessfully inserted in ' + elapsedMs + ' ms.');
	process.exit();
});	