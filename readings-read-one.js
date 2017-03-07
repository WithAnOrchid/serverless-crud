'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {
  console.log(event);
  const params = {
    TableName: 'readings',
    Key: {
      sensor_id: event.pathParameters.sensor_id,
      published_at: event.pathParameters.published_at
    }
  };

  return dynamoDb.get(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data.Item);
  });
};
