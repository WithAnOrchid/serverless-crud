'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {
  const sensor_id = event.queryStringParameters.sensor_id;
  const published_at = parseInt(event.queryStringParameters.published_at);
  const params = {
    TableName : 'readings',
    Key: {
      sensor_id: sensor_id,
      published_at: published_at
    }
  };

  return dynamoDb.delete(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Key);
  });
};
