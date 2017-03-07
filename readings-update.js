'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);

  data.sensor_id = event.pathParameters.sensor_id;
  data.published_at = event.pathParameters.published_at;
  var timeInMs = Date.now();
  data.processed_at = timeInMs;

  const params = {
    TableName : 'readings',
    Item: data
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Item);
  });
};
