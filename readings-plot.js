'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {

	console.log("Event: " + JSON.stringify(event));

	var sensor_id;
	var published_at;
	var limit;

	var has_parameters = false;
	var has_sensor_id = false;
	var has_published_at = false;
	var has_limit = false;

	var table = "readings";
	var params;

	if (event.queryStringParameters !== null && 
		event.queryStringParameters !== undefined) 
	{
		has_parameters = true;
		if (event.queryStringParameters.sensor_id !== undefined && 
			event.queryStringParameters.sensor_id !== null && 
			event.queryStringParameters.sensor_id !== "") 
		{
			has_sensor_id = true;
			sensor_id = event.queryStringParameters.sensor_id;
		}
		if (event.queryStringParameters.published_at !== undefined && 
			event.queryStringParameters.published_at !== null && 
			event.queryStringParameters.published_at !== "") 
		{
			has_published_at = true;
			published_at = parseInt(event.queryStringParameters.published_at);
		}
		if (event.queryStringParameters.limit !== undefined && 
			event.queryStringParameters.limit !== null && 
			event.queryStringParameters.limit !== "") 
		{
			has_limit = true;
			limit = parseInt(event.queryStringParameters.limit);
		}

	}
	
	// Start set params
	if(has_parameters)
	{
		// has some params
		if(has_sensor_id)
		{
			if(has_published_at)
			{
				// Take as LastEvaluatedKey
				params = {
					TableName: table,
					ConsistentRead: true,
					KeyConditionExpression:"sensor_id = :sensor_id",
					ExpressionAttributeValues: {
						":sensor_id": sensor_id
					},
					ExclusiveStartKey: {
						"sensor_id": sensor_id,
						"published_at": published_at
					}
				};
			}
			else
			{
				// Only has sensor_id, to be used as retrive latest x readings
				// read backwards
				params = {
					TableName: table,
					ConsistentRead: true,
					KeyConditionExpression:"sensor_id = :sensor_id",
					ExpressionAttributeValues: {
						":sensor_id": sensor_id
					},
					ScanIndexForward: false
				};
			}
		}
		else
		{
			// no sensor_id
			params = {
				TableName: table,
				ConsistentRead: true
			};
		}
	}
	else
	{
		// no params
		params = {
			TableName: table,
			ConsistentRead: true
		};
	}// end of all if-else block

// limit can be combined into any params
if(has_limit)
{
	params.Limit = limit;
}


console.log("Params: " + JSON.stringify(params));

// determin call scan or query
if(!has_sensor_id)
{
	return dynamoDb.scan(params, (error, data) => {
		if (error) {
			callback(error);
		}
		callback(error, data);
	});
}
else
{
	return dynamoDb.query(params, (error, data) => {
		if (error) {
			callback(error);
		}
		else
		{
			if(!has_published_at)
			{
				data.Items.sort(function(a, b){
					return parseInt(a.published_at) - parseInt(b.published_at);
				}); 
			}
		}
		callback(error, data);
	});

}
};