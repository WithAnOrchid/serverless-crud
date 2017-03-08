'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {

console.log("Event: " + JSON.stringify(event));

var sensor;
var params;
var from_timestamp;
var end_timestamp;

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
      sensor = event.queryStringParameters.sensor_id;

      if (event.queryStringParameters.start !== undefined && 
        event.queryStringParameters.start !== null && 
        event.queryStringParameters.start !== "") 
      {
      	// start is provided 
        console.log("Received start_timestamp: " + event.queryStringParameters.start);
        start_timestamp = event.queryStringParameters.start;

        if (event.queryStringParameters.end !== undefined && 
        	event.queryStringParameters.end !== null && 
        	event.queryStringParameters.end !== "") 
      	{
      		// all info is provided
        	console.log("Received end_timestamp: " + event.queryStringParameters.end);
        	end_timestamp = event.queryStringParameters.end;

	        params = {
	          TableName: table,
	          ConsistentRead: true,
	          KeyConditionExpression:"#sensor_id = :sensor and #published_at BETWEEN :start_timestamp AND :end_timestamp",
        	  ExpressionAttributeNames: {
            	"#sensor_id":"sensor_id",
            	"#start_timestamp":"start_timestamp",
            	"#end_timestamp":"end_timestamp"
            	},
              ExpressionAttributeValues: {
            	":sensor":sensor,
            	":start":start_timestamp,
            	":end":end_timestamp
            	}    
	        };
      	}
      	else
      	{
      		// have sensor_id, start_timestamp, end_timestamp not given
      		console.log("have sensor_id, start_timestamp, end_timestamp not given ");
      		params = {
	          TableName: table,
	          ConsistentRead: true,
	          KeyConditionExpression:"#sensor_id = :sensor and #published_at BETWEEN :start_timestamp AND :end_timestamp",
        	  ExpressionAttributeNames: {
            	"#sensor_id":"sensor_id",
            	"#start_timestamp":"start_timestamp",
            	"#end_timestamp":"end_timestamp"
            	},
              ExpressionAttributeValues: {
            	":sensor":sensor,
            	":start":start_timestamp,
            	":end":Date.now()
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
	          KeyConditionExpression:"#sensor_id = :sensor",
        	  ExpressionAttributeNames: {
            	"#sensor_id":"sensor_id"
            	},
              ExpressionAttributeValues: {
            	":sensor":sensor
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
    }

  }
  else
  {
  	// we got nothing from URL
  	console.log("we got nothing from URL");
    params = {
      TableName: 'readings',
      ConsistentRead: true    
    };
  }//end of URL parameters validation

  console.log('params is ' + JSON.stringify(params));

  return dynamoDb.query(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data);
  });
};
