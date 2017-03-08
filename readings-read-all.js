'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

console.log('Loading read-all');

module.exports = (event, callback) => {
  console.log('Event is ' + JSON.stringify(event));
  const params = {
    TableName: 'readings',
  };

  return dynamoDb.scan(params, (error, data) => {
  	console.log('Data is ' + JSON.stringify(data));
    if (error) {
      callback(error);
    }
    callback(error, data);
  });
};
