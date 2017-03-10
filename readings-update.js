'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);
  const sensor_id = event.queryStringParameters.sensor_id;
  const published_at = parseInt(event.queryStringParameters.published_at);

  data.sensor_id = sensor_id;
  data.sensor_id = published_at;
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
