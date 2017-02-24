'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
//const uuid = require('uuid');

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);

  //data.id = uuid.v1();
  var timeInMs = Date.now();
  data.processed_at = timeInMs;

  const params = {
    TableName: 'readings',
    Item: data
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Item);
  });
};
