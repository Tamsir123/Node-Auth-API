var mysql = require("mysql");
var connection = require("../database");
let bcrypt = require("bcrypt");

module.exports = async function (req, res) {
  const id = req.params.id;
  
  try {
    // Récupérer les données à mettre à jour
    const userData = {};
    
    // Vérifier chaque champ et l'ajouter à l'objet userData s'il est présent
    if (req.body.nom) userData.nom = req.body.nom;
    if (req.body.prenom) userData.prenom = req.body.prenom;
    if (req.body.email) userData.email = req.body.email;
    if (req.body.telephone) userData.telephone = req.body.telephone;
    
    // Si un nouveau mot de passe est fourni, le hasher
    if (req.body.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(req.body.password, saltRounds);
    }
    
    // Vérifier si l'utilisateur existe
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
      
      // Si un email est fourni, vérifier qu'il n'est pas déjà utilisé par un autre utilisateur
      if (userData.email) {
        const checkEmailSql = 'SELECT id FROM utilisateurs WHERE email = ? AND id != ?';
        connection.query(checkEmailSql, [userData.email, id], function(errEmail, rowsEmail) {
          if (errEmail) {
            return res.json({
              "Error": true,
              "Message": "Erreur lors de la vérification de l'email: " + errEmail
            });
          }
          
          if (rowsEmail.length > 0) {
            return res.json({
              "Error": true,
              "Message": "Cet email est déjà utilisé par un autre utilisateur."
            });
          }
          
          // Mettre à jour l'utilisateur
          updateUserData(id, userData, res);
        });
      } else {
        // Mettre à jour l'utilisateur sans vérifier l'email
        updateUserData(id, userData, res);
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.json({
      "Error": true,
      "Message": "Erreur lors de la mise à jour: " + error.message
    });
  }
};

function updateUserData(id, userData, res) {
  const updateSql = 'UPDATE utilisateurs SET ? WHERE id = ?';
  
  connection.query(updateSql, [userData, id], function(err, result) {
    if (err) {
      return res.json({
        "Error": true,
        "Message": "Erreur lors de la mise à jour: " + err
      });
    }
    
    if (result.affectedRows === 0) {
      return res.json({
        "Error": true,
        "Message": "Aucune modification n'a été effectuée."
      });
    }
    
    res.json({
      "Error": false,
      "Message": "Utilisateur mis à jour avec succès.",
      "AffectedRows": result.affectedRows
    });
  });
}
