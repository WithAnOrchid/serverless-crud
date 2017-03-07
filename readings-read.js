'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {
  console.log("Event: " + JSON.stringify(event));

  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
    if (event.queryStringParameters.sensor_id !== undefined && event.queryStringParameters.sensor_id !== null && event.queryStringParameters.name !== "") {
        console.log("Received sensor_id: " + event.queryStringParameters.sensor_id);
        sensor_id = event.queryStringParameters.sensor_id;
        }

    if (event.queryStringParameters.published_at !== undefined && event.queryStringParameters.published_at !== null && event.queryStringParameters.published_at !== "") {
        console.log("Received http published_at: " + event.queryStringParameters.published_at);
        published_at = event.queryStringParameters.published_at;
        }
  }        

  const params = {
    TableName: 'readings',
    Key: {
      sensor_id: sensor_id,
      published_at: published_at
    }    
  };

  console.log("params: " + JSON.stringify(params));

  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data);
  });
};
