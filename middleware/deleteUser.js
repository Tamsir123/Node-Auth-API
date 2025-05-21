var mysql = require("mysql");
var connection = require("../database");

module.exports = function (req, res) {
  const id = req.params.id;

  // Vérifier d'abord si l'utilisateur existe
  const checkUserSql = 'SELECT * FROM utilisateurs WHERE id = ?';
  
  connection.query(checkUserSql, [id], function(err, rows) {
    if (err) {
      return res.json({
        "Error": true,
        "Message": "Erreur lors de la vérification de l'utilisateur: " + err
      });
    }
    
    if (rows.length === 0) {
      return res.json({
        "Error": true,
        "Message": "Utilisateur non trouvé avec l'ID: " + id
      });
    }
    
    // L'utilisateur existe, procéder à la suppression
    const deleteSql = 'DELETE FROM utilisateurs WHERE id = ?';
    
    connection.query(deleteSql, [id], function(err, result) {
      if (err) {
        return res.json({
          "Error": true,
          "Message": "Erreur lors de la suppression: " + err
        });
      }
      
      res.json({
        "Error": false,
        "Message": "Utilisateur supprimé avec succès.",
        "AffectedRows": result.affectedRows
      });
    });
  });
};
