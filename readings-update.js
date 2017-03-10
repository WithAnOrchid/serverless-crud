'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);
  const sensor_id = event.queryStringParameters.sensor_id;
  const published_at = parseInt(event.queryStringParameters.published_at);

<<<<<<< HEAD
  data.sensor_id = sensor_id;
  data.sensor_id = published_at;
=======
>>>>>>> 1bb88ec56ffca23d44c4acc38dc9a926524b0ed9
  var timeInMs = Date.now();
  data.processed_at = timeInMs;

/////////////////////////


var sensor_id;
var params;
var published_at;
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

      if (event.queryStringParameters.published_at !== undefined && 
        event.queryStringParameters.published_at !== null && 
        event.queryStringParameters.published_at !== "") 
      {
        // published_at is provided 
        console.log("Received published_at: " + event.queryStringParameters.published_at);
        published_at = parseInt(event.queryStringParameters.published_at);
        params = {
            TableName : 'readings',
            Item: data  
          };
      }
      else
      {
        // have sensor_id, no published_at
        console.log("Have sensor_id, but no published_at");

      return callback(new Error('Have sensor_id, but no published_at'));
    }
    else
    {
      // no sensor_id
      console.log("No sensor_id");

      return callback(new Error('No sensor_id'));
    }

  }
  else
  {
    // we got nothing from URL
    console.log("Insufficient parameters.");
      return callback(new Error('Insufficient parameters.'));
  }//end of URL parameters validation


////////////////////

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Item);
  });
};
