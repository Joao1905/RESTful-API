/*
The DAO, or Database access object, has the goal to simplify DynamoDB connections through a set of defined functions. It is also
    a layer of abstraction, which simplifies the development of database accesses 

API:    select(response, callback(result))
            Select all from employees database
            Return query results
            Handles query results inside callback(result) function defined by user
        selectById(employee_id, response, callback(result))
            Select employee with given employee_id
            Return query results
            Handles query result inside callback(result) function defined by user
        insert(age, name, role, response, callback(result))
            Insert age, name and role in next available id of employees database
            Return inserted item
            Handles operation results inside callback(result) function defined by user
        update(employee_id, age, name, role, response, callback(result))
            Update age, name and/or role of employee_id to new given values
            Return updated item
            Handles operation results inside callback(result) function defined by user
        erase(employee_id, res, callback)
            Deletes employee with employee_id from database
            Return deleted item
            Handles operation results inside callback(result) function defined by user
*/

const { v4: uuidv4 } = require('uuid');
const employee = require("./employee.js");
let AWS = require("aws-sdk");
const AWSconfig = {
    "region": "us-east-1",
    "endpoint": "https://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "XXXX",
    "secretAccessKey": "XXXX"
};

function select(res, callback) {
    AWS.config.update(AWSconfig);
    let docClient = new AWS.DynamoDB.DocumentClient();
    const params = employee.getAllEmployees();
  
    docClient.scan(params, function (err, data) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        callback(data.Items);
    });
}

function selectById(id, res, callback){
    AWS.config.update(AWSconfig);
    let docClient = new AWS.DynamoDB.DocumentClient();
    const params = employee.getEmployee(id);

    docClient.get(params, function (err, data) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        callback(data.Item);
    });
}


function insert(age, name, role, res, callback) {
    AWS.config.update(AWSconfig);
    let docClient = new AWS.DynamoDB.DocumentClient();

    const params = employee.insertEmployee(uuidv4(), age, name, role);

    docClient.put(params, function (err, data) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        callback(params.Item);
    });
}


function update(id, age = undefined, name = undefined, role = undefined, res, callback) {
    AWS.config.update(AWSconfig);
    let docClient = new AWS.DynamoDB.DocumentClient();

    selectById(id, res, function(result){

        if (result === undefined) {
            res.status(404).send("Employee not found");
            return;
        }

        if (age === undefined) age = result.age;
        if (name === undefined) name = result.name;
        if (role === undefined) role = result.role;

        const params = employee.updateEmployee(id, age, name, role);

        docClient.update(params, function (err, data) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            callback(params.ReturnItems);
        });
    });
}


function erase(id, res, callback) {
    AWS.config.update(AWSconfig);
    let docClient = new AWS.DynamoDB.DocumentClient();
    const params = employee.deleteEmployee(id);

    docClient.delete(params, function (err, data) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        callback(data.Attributes);
    });
}

module.exports.select = select;
module.exports.selectById = selectById;
module.exports.insert = insert;
module.exports.update = update;
module.exports.erase = erase;