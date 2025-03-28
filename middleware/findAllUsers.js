
var mysql   = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");


const findAllUsers  = async (req, res) => {
    
    try {
        

	const query = "SELECT * FROM ?? ";

    const table = ["user"];

    query = mysql.format(query,table);

    connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "Users" : rows});
        }
    });

} catch (error) {
    res.json({"Error" : true, "Message" : error });

}

};

module.exports = findAllUsers;