
const mysql = require('mysql2');

const connection = mysql.createConnection({

     host: 'localhost',   
    user: 'root',
    password: 'Tam@1#',
    database: 'api2ie',


    
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
  
