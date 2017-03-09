'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {

console.log("Event: " + JSON.stringify(event));

var sensor_id;
var params;
var start_timestamp;
var end_timestamp;
var table = "readings";

  if (event.queryStringParameters !== null && 
      event.queryStringParameters !== undefined) 
  {
  	// we got some params from URL
    if (event.queryStringParameters.sensor_id !== undefined && 
        event.queryStringParameters.sensor_id !== null && 
        event.queryStringParameters.name !== "") 
    {
    	// sensor_id is provided
      console.log("Received sensor_id: " + event.queryStringParameters.sensor_id);
      sensor_id = event.queryStringParameters.sensor_id;

      if (event.queryStringParameters.start_timestamp !== undefined && 
        event.queryStringParameters.start_timestamp !== null && 
        event.queryStringParameters.start_timestamp !== "") 
      {
      	// start is provided 
        console.log("Received start_timestamp: " + event.queryStringParameters.start_timestamp);
        start_timestamp = parseInt(event.queryStringParameters.start_timestamp);

        if (event.queryStringParameters.end_timestamp !== undefined && 
        	event.queryStringParameters.end_timestamp !== null && 
        	event.queryStringParameters.end_timestamp !== "") 
      	{
      		// all info is provided
        	console.log("Received end_timestamp: " + event.queryStringParameters.end_timestamp);
        	end_timestamp = parseInt(event.queryStringParameters.end_timestamp);

	        params = {
	          TableName: table,
	          ConsistentRead: true,
	          KeyConditionExpression:"sensor_id = :sensor_id AND published_at BETWEEN :start_timestamp AND :end_timestamp",
              ExpressionAttributeValues: {
            	":sensor_id": sensor_id,
            	":start_timestamp": start_timestamp,
            	":end_timestamp": end_timestamp
            	}    
	        };
      	}
      	else
      	{
      		// have sensor_id, start_timestamp, end_timestamp not given
      		console.log("have sensor_id, start_timestamp, but end_timestamp not given ");
      		var currTime = Date.now();
      		params = {
	          TableName: table,
	          ConsistentRead: true,
	          KeyConditionExpression:"sensor_id = :sensor_id AND published_at BETWEEN :start_timestamp AND :end_timestamp",
              ExpressionAttributeValues: {
            	":sensor_id": sensor_id,
            	":start_timestamp": start_timestamp,
            	":end_timestamp": currTime
            	}    
	        };
      	}

      }
      else
      {
      	// have sensor_id, no start_timestamp
      	console.log("have sensor_id, no start_timestamp");
      		params = {
	          TableName: table,
	          ConsistentRead: true,
	          KeyConditionExpression:"sensor_id = :sensor_id",
              ExpressionAttributeValues: {
            	":sensor_id": sensor_id
            }
	        };
      }
    }
    else
    {
    	// no sensor_id
    	console.log("no sensor_id");
    	params = {
      		TableName: 'readings',
      		ConsistentRead: true   
    	};

    	return dynamoDb.scan(params, (error, data) => {
    	if (error) {
      	callback(error);
    	}
    	callback(error, data);
  		});
    }

  }
  else
  {
  	// we got nothing from URL
  	console.log("we got nothing from URL");

    params = {
      TableName: table,
      ConsistentRead: true    
    };

    return dynamoDb.scan(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data);
  });
  }//end of URL parameters validation

  console.log('params is ' + JSON.stringify(params));

  return dynamoDb.query(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data);
  });
};
