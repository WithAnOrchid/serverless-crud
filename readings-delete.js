'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {
  const params = {
    TableName : 'readings',
    Key: {
      sensor_id: event.pathParameters.sensor_id,
      published_at: event.pathParameters.published_at
    }
  };

  return dynamoDb.delete(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Key);
  });
};
