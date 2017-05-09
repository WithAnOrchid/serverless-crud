'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
//const uuid = require('uuid');

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);

  //data.id = uuid.v1();
  //var timeInMs = Date.now();
  data.published_at = Date.now();
  data.processed_at = Date.now();

  // Special case for TH module
  if(data.temperature_reading != undefined &&
   data.temperature_reading != null)
  {

    // NEW CHANGE
    var lambda = new AWS.Lambda({
    region: 'us-east-1' //change to your region
  });
    const event = {
      "queryStringParameters": {
        "rh": parseFloat(data.humidity_reading),
        "ta": parseFloat(data.temperature_reading)
      }
    };
    console.log(event);
    var PMV = 0.0;
    var APMV = 0.0;
    var PPD = 0.0;

    lambda.invoke({
      FunctionName: 'pmv-dev-computePMV',
    Payload: JSON.stringify(event, null, 2) // pass params
  }, function(error, data2) {
    if (error) {
        //context.done('error', error);
        console.log("in error");
        console.log(error);
      }
      if(data2.Payload){
        console.log("in succeed");
        //context.succeed(data.Payload)
        const temp = JSON.parse(data2.Payload);
        const result = JSON.parse(temp.body);
        PMV = parseFloat(result.PMV);
        APMV = parseFloat(result.APMV);
        PPD = parseFloat(result.PPD);
        console.log(result);


            // Split the single JSON to 2 JSONs
    var data1 = {
      sensor_id: 'TEMPERATURE-' + data.sensor_id,
      device_id: data.device_id,
      device_type: data.device_type,
      sensor_type: 'temperature',
      sensor_reading: data.temperature_reading,
      published_at: data.published_at,
      processed_at: data.processed_at
    };
    var data2 = {
      sensor_id: 'HUMIDITY-' + data.sensor_id,
      device_id: data.device_id,
      device_type: data.device_type,
      sensor_type: 'humidity',
      sensor_reading: data.humidity_reading,
      published_at: data.published_at,
      processed_at: data.processed_at
    };

    var data3 = {
      sensor_id: 'PMV-' + data.sensor_id,
      device_id: data.device_id,
      device_type: data.device_type,
      sensor_type: 'PMV_NOT_A_SENSOR',
      sensor_reading: PMV,
      published_at: data.published_at,
      processed_at: Date.now()
    };

    var data4 = {
      sensor_id: 'APMV-' + data.sensor_id,
      device_id: data.device_id,
      device_type: data.device_type,
      sensor_type: 'APMV_NOT_A_SENSOR',
      sensor_reading: APMV,
      published_at: data.published_at,
      processed_at: Date.now()
    };

    var data5 = {
      sensor_id: 'PPD-' + data.sensor_id,
      device_id: data.device_id,
      device_type: data.device_type,
      sensor_type: 'PPD_NOT_A_SENSOR',
      sensor_reading: PPD,
      published_at: data.published_at,
      processed_at: Date.now()
    };
    
    var params1 = {
      TableName: 'readings',
      Item: data1
    };
    var params2 = {
      TableName: 'readings',
      Item: data2
    };

    var params3 = {
      TableName: 'readings',
      Item: data3
    };

    var params3 = {
      TableName: 'readings',
      Item: data4
    };

    var params3 = {
      TableName: 'readings',
      Item: data5
    };
    
    dynamoDb.put(params1, function(err, data) {
      if (err) console.log("Unable to update item. Error: ", JSON.stringify(err, null, 2));
      else console.log("Updated item succeeded: ", JSON.stringify(data, null, 2));
            //next() // modify for err handling
          });

    dynamoDb.put(params2, function(err, data) {
      if (err) console.log("Unable to update item. Error: ", JSON.stringify(err, null, 2));
      else console.log("Updated item succeeded: ", JSON.stringify(data, null, 2));
            //next() // modify for err handling
          });

    dynamoDb.put(params3, function(err, data) {
      if (err) console.log("Unable to update item. Error: ", JSON.stringify(err, null, 2));
      else console.log("Updated item succeeded: ", JSON.stringify(data, null, 2));
            //next() // modify for err handling
          });

    dynamoDb.put(params4, function(err, data) {
      if (err) console.log("Unable to update item. Error: ", JSON.stringify(err, null, 2));
      else console.log("Updated item succeeded: ", JSON.stringify(data, null, 2));
            //next() // modify for err handling
          });

    return dynamoDb.put(params5, (error, data) => {
      if (error) {
        callback(error);
      }
      callback(error, params5.Item);
    });
      }
    });

    
    

  } // end of if
  else
  {
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

}// end of else
};
