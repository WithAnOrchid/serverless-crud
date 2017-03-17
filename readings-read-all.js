'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, callback) => {

  console.log("Event: " + JSON.stringify(event));

  var sensor_id;
  var start_timestamp;
  var end_timestamp;
  var last_sensor_id;
  var last_published_at;
  var limit;
  var scan_forward;

  var has_parameters = false;
  var has_sensor_id = false;
  var has_start_timestamp = false;
  var has_end_timestamp = false;
  var has_last_sensor_id = false;
  var has_last_published_at = false;
  var has_limit = false;
  var has_scan_forward = false;

  var table = "readings";
  var params;

  if (event.queryStringParameters !== null && 
    event.queryStringParameters !== undefined) 
  {
    has_parameters = true;
    if (event.queryStringParameters.sensor_id !== undefined && 
      event.queryStringParameters.sensor_id !== null && 
      event.queryStringParameters.sensor_id !== "") 
    {
      has_sensor_id = true;
      sensor_id = event.queryStringParameters.sensor_id;
    }
    if (event.queryStringParameters.start_timestamp !== undefined && 
      event.queryStringParameters.start_timestamp !== null && 
      event.queryStringParameters.start_timestamp !== "") 
    {
      has_start_timestamp = true;
      start_timestamp = parseInt(event.queryStringParameters.start_timestamp);
    }
    if (event.queryStringParameters.end_timestamp !== undefined && 
      event.queryStringParameters.end_timestamp !== null && 
      event.queryStringParameters.end_timestamp !== "") 
    {
      has_end_timestamp = true;
      end_timestamp = parseInt(event.queryStringParameters.end_timestamp);
    }
    if (event.queryStringParameters.last_sensor_id !== undefined && 
      event.queryStringParameters.last_sensor_id !== null && 
      event.queryStringParameters.last_sensor_id !== "") 
    {
      has_last_sensor_id = true;
      last_sensor_id = event.queryStringParameters.last_sensor_id;
    }
    if (event.queryStringParameters.last_published_at !== undefined && 
      event.queryStringParameters.last_published_at !== null && 
      event.queryStringParameters.last_published_at !== "") 
    {
      has_last_published_at = true;
      last_published_at = parseInt(event.queryStringParameters.last_published_at);
    }
    if (event.queryStringParameters.limit !== undefined && 
      event.queryStringParameters.limit !== null && 
      event.queryStringParameters.limit !== "") 
    {
      has_limit = true;
      limit = parseInt(event.queryStringParameters.limit);
    }
    if (event.queryStringParameters.scan_forward !== undefined && 
      event.queryStringParameters.scan_forward !== null && 
      event.queryStringParameters.scan_forward !== "") 
    {
      has_scan_forward = true;
      scan_forward = event.queryStringParameters.scan_forward;
    }

  }
  
  // Start set params
  if(has_parameters)
  {
    // has some params
    if(has_sensor_id)
    {
      // sensor_id is set
      if(has_start_timestamp)
      {
        // sensor_id is set, start_timestamp is set
        if(has_end_timestamp)
        {
          // sensor_id is set, start_timestamp is set, end_timestamp is set
          params = {
            TableName: table,
            ConsistentRead: true,
            KeyConditionExpression:"sensor_id = :sensor_id AND published_at BETWEEN :start_timestamp AND :end_timestamp",
            ExpressionAttributeValues: {
              ":sensor_id": sensor_id,
              ":start_timestamp": start_timestamp,
              ":end_timestamp": end_timestamp
            }    
          };
        }
        else
        {
          // sensor_id is set, start_timestamp is set, end_timestamp not set
          var currTime = Date.now();
          params = {
            TableName: table,
            ConsistentRead: true,
            KeyConditionExpression:"sensor_id = :sensor_id AND published_at BETWEEN :start_timestamp AND :end_timestamp",
            ExpressionAttributeValues: {
              ":sensor_id": sensor_id,
              ":start_timestamp": start_timestamp,
              ":end_timestamp": currTime
            }    
          };
        }
      }
      else
      {
        // sensor_id is set, start_timestamp not set
        params = {
          TableName: table,
          ConsistentRead: true,
          KeyConditionExpression:"sensor_id = :sensor_id",
          ExpressionAttributeValues: {
            ":sensor_id": sensor_id
          }
        };
      }
    }
    else
    {
      // no sensor_id
      params = {
        TableName: table,
        ConsistentRead: true   
      };
    }
  }
  else
  {
    // no params
    params = {
      TableName: table,
      ConsistentRead: true    
    };
  }// end of all if-else block

// special condtions
if(has_last_sensor_id && has_last_published_at)
{
  params.ExclusiveStartKey = {
    sensor_id: last_sensor_id,
    published_at: last_published_at
  };
}

if(has_limit)
{
  params.Limit = limit;
}


if(has_scan_forward)
{
  params.ScanIndexForward = scan_forward;
}

// determin call scan or query
if(!has_sensor_id)
{
  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data);
  });
}
else
{
  console.log(params);
  return dynamoDb.query(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data);
  });
}
};