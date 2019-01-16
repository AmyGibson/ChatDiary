const AWS = require("aws-sdk");

/*AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});*/

//const ddb = new AWS.DynamoDB.DocumentClient();
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});



exports.handler = (event, context, callback) => {
   
   var params = {
   // "AttributesToGet": [ "string" ],
    TableName: "ComprehendOutput",
    KeyConditionExpression: "filename = :a",
    ExpressionAttributeValues: {":a": "record30102018115224"}
    //TableName : "ComprehendOutput",
    //Key:{
    //    filename:{ S:"record30102018115224" }
    //}
    };
   
    //var testData = getTestData();
    //callback(null, { "statusCode" : 200, "body" : JSON.stringify((testData))});
    
    
    let filename = event.queryStringParameters.filename;
    //let filename = "record30102018115224";
    ddb.scan({
        ProjectionExpression: "transcript, keyPhrases, sentiment",
        TableName : "ComprehendOutput",
        FilterExpression : "filename = :name",
        ExpressionAttributeValues: {
        ":name": {"S":filename}
        },
        Limit : 10
    }, function(err, data) {
        if (err) {
             callback(null, { "headers": {'Access-Control-Allow-Origin': '*'},"statusCode" : 200, "body" : JSON.stringify((err))});
            
            //context.done('error','reading dynamodb failed: '+err);
        }else{
        console.log(data)
        //context.done(null, "Ciao!");
        callback(null, { "headers": {'Access-Control-Allow-Origin': '*'},"statusCode" : 200, "body" : JSON.stringify((data))});
        }
    });
    
    console.log("here.");
    /*
    ddb.getItem({
    TableName: "ComprehendOutput",
    Key: {
        timestamp: { N: "1543544164697" }
    }
}, context.done);*/
/*ddb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            callback(null, { "statusCode" : 200, "body" : JSON.stringify((data))});
           // callback(null, { "statusCode" : 200, "body" : JSON.stringify((data))});
           
        }
    });*/
    
    /*
    ddb.getItem(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            callback(null, { "statusCode" : 200, "body" : JSON.stringify((data))});
           // callback(null, { "statusCode" : 200, "body" : JSON.stringify((data))});
           
        }
    });*/
    
    
};

function getTestData() {
    var test= [ "aaa", "bbb", "ccc", "ddd", "eee", "fff", "ggg" ];
    return test.sort(() => .5 - Math.random()); // random sort just to see that the data is not cached somehow
}