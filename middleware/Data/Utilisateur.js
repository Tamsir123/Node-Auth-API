
var mysql   = require("mysql");
var connection = require("../../database");


module.exports = async (req, res) => {

let query = `SELECT * from utilisateurs`;

query = mysql.format(query);   


query = mysql.format(query);

connection.query(query, function(err,rows){
    if(err) {
        res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    } else {
        res.send(rows);
    }
});



};