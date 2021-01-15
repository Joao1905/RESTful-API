/*
Handles API requests in a RESTful way
Framework uses express (requests and responses, error handling), joi (validation handling) and NoSQL (database)
AWS Framework uses Lambda, API Gateway and DynamoDB
Input validation and error handling already implemented

API:    GET "/api/employees"
        GET "/api/employees/id"
        POST "/api/employees"
        PUT "/api/employees/id"
        DELETE "/api/employees/id"
*/


const serverless = require('serverless-http');

const express = require("express");
const app = express();
app.use(express.json());

const Joi = require('joi');

const dao = require("./dao/dao.js");


/***************************
REQUEST HANDLING FUNCTIONS
****************************/
app.get("/", (req, res) => {
    res.send("My employee backend :)");
})

app.get("/employees", (req, res) => {
    //Return array with all employees (JSON format)
    dao.select(res, function(result){
        res.send(result);
    });
});


app.get("/employees/:id", (req, res) => {
    
    const givenId = req.params.id;
    //Check if given id is valid
    
    const idResult = validateId(givenId);
    if (idResult.error) {
        res.status(400).send(idResult.error.details[0].message);
        return;
    }

    dao.selectById(givenId, res, function(result){
        //Check if employee with given id exists
        if (result === undefined) {
            res.status(404).send("Employee not found");
            return;
        }
        //Return JSON with the data of specified employee
        res.send(result);
    });
});


app.post("/employees", (req, res) => {
    //Check if given values are valid
    const valueResult = validateKeys().validate(req.body);
    if (valueResult.error) {
        res.status(400).send(valueResult.error.details[0].message);
        return;
    }

    //Insert new employee in database
    dao.insert(req.body.age, req.body.name, req.body.role, res, function(result){
        //Return new employee JSON
        res.send(result);
    });
});


app.put("/employees/:id", (req, res) => {
    
    const givenId = req.params.id;

    //Check if given id is valid
    const idResult = validateId(givenId);
    if (idResult.error) {
        res.status(400).send(idResult.error.details[0].message);
        return;
    }

    //Check if given update keys are valid
    const valueResult = validateKeys(false).validate(req.body);  //False means keys are not required (you don't need to pass "name" on your put request, for example)
    if (valueResult.error) {
        res.status(400).send(valueResult.error.details[0].message);
        return;
    }

    //Update database and employee object values, send employee object
    dao.update(givenId, req.body.age, req.body.name, req.body.role, res, function(result){
        //Check of employee id existance is done inside update function
        res.send(result);
    });
});


app.delete("/employees/:id", (req, res) => {

    const givenId = req.params.id;

    //Check if given id is valid
    const idResult = validateId(givenId);
    if (idResult.error) {
        res.status(400).send(idResult.error.details[0].message);
        return;
    }

    //Delete specified employee, and return deleted data
    dao.erase(givenId, res, function(result){
        //Check if employee with given id exists
        if (result === undefined) {
            res.status(404).send("Employee not found");
            return;
        }
        res.send(result);
    });
});

/*******************
VALIDATION FUNCTIONS
********************/
function validateId(givenId) {
    const schema = Joi.object({
        id: Joi.string().guid({
          version: ['uuidv4']
        })
    });

    return schema.validate({ id: givenId});
}

function validateKeys(required = true) {
    
    let valueSchema = Joi.object({
        age: Joi.number().integer().min(0).required(),              //0 is included
        name: Joi.string().alphanum().min(3).max(45).required(),    //Alphanum = A-Z, 0-9
        role: Joi.string().alphanum().min(3).max(45).required()
    });

    if (required === false) {
        valueSchema = Joi.object({
            age: Joi.number().integer().min(0),              //0 is included
            name: Joi.string().alphanum().min(3).max(45),    //Alphanum = A-Z, 0-9
            role: Joi.string().alphanum().min(3).max(45)
        });
    }

    return valueSchema;
}


/***********************
ERROR HANDLING FUNCTIONS
***********************/
app.use(require('body-parser').json()); 
app.use(require('body-parser').urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.sendStatus(400); // Bad request
    }

    return res.sendStatus(500);
});


/*********
CONNECTION
**********/
const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports.handler = serverless(app);