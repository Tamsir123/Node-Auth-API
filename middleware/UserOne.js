var mysql = require("mysql");
var connection = require("../database");
// const log = require('log-to-file');

module.exports = function (req, res) {
//   const ID = req.params.id;
  const id = req.params.id;

  let post = {
    id: +id, // parseInt(ID)
  };

  const sql = 'SELECT * FROM `utilisateurs` WHERE id = ?';

  console.log(sql);
  connection.query(sql, [id], function (err, rows) {
    if (err) {
      res.json({
        "Error": true,
        "Message": "Error executing MySQL query \n" + err
      });
    } else {
      res.send({  
        Error: false,
        Message: "Affichage avec succes  id =  " + id ,
        donnees: rows[0],
      });
    //   res.send(rows);
    }
  });
};
