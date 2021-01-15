/*
This module is used to create the required DynamoDB parameters, and it is another layer of abstraction
  and simplification
There's one function for each API endpoint available
"ReturnValues" key is usually an optional key for DynamoDB queries, but is essential to this application
*/

function getAllEmployees() {
    return {
        "TableName": "Employees"
    }
}

function getEmployee(id) {
    return {
        "TableName": "Employees",
        "Key": {
            "employee_id": id
        }
    }
}

function insertEmployee(id, age, name, role) {
    return {
        "TableName": "Employees",
        "Item": {
            "employee_id": id,
            "age": age,
            "name": name,
            "role": role
        }
    }
}

function updateEmployee(id, age, name, role) {
    return {
        "TableName": "Employees",
        "Key":{
            "employee_id": id
        },
        "UpdateExpression": "set #age=:a, #name=:n, #role=:r",
        "ExpressionAttributeValues":{
            ":a":age,
            ":n":name,
            ":r":role
        },
        ExpressionAttributeNames: {
            "#age": "age",
            "#name": "name",
            "#role": "role"
        },
        "ReturnValues":"UPDATED_NEW",
        "ReturnItems": {        //This was simply created to be returned at the end of dao.update() function
            "employee_id":id,
            "age":age,
            "name":name,
            "role":role
        }
    }
}

function deleteEmployee(id) {
    return {
        "TableName": "Employees",
        "Key": {
            "employee_id": id
        },
        "ReturnValues": "ALL_OLD"
    }
}

module.exports.getAllEmployees = getAllEmployees;
module.exports.getEmployee = getEmployee;
module.exports.insertEmployee = insertEmployee;
module.exports.updateEmployee = updateEmployee;
module.exports.deleteEmployee = deleteEmployee;

