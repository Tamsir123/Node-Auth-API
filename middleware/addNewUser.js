
var mysql   = require("mysql2");
let bcrypt = require("bcrypt");
var connection = require("../database");


const addNewUser  = async (req, res, next) => {
	
try {
		

  let saltRounds = 10; // Nombre de rounds pour le salage
  let hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  let post = {
	  nom: req.body.nom,
	  prenom: req.body.prenom,
	  email: req.body.email,
	  password: hashedPassword, // Mot de passe sécurisé
	  telephone: req.body.telephone,
  };


  console.log(post);
  
  let query = "SELECT email FROM ?? WHERE ??=?";

  let table = ["utilisateurs", "email", post.email];

		query = mysql.format(query,table);

		connection.query(query,function(err,rows){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		} 
		else {

		if(rows.length==0){

			let query = "INSERT INTO  ?? SET  ?";
			let table = ["utilisateurs"];
			query = mysql.format(query,table);
			connection.query(query, post, function(err,rows){
				if(err) {
					res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				} else {
					res.json({"Error" : false, "Message" : "Success"});
				}
			});

		}
		else{
			res.json({"Error" : false, "Message" : "Email Id already registered"});
		}
		}
    });

		} catch (error) {
			// res.json( {"Error" : true, " Message " : error.Message });

		    console.error('Erreur :', error);           // Affiche l'erreur complète
    console.error('Message d\'erreur :', error.message);     // Message uniquement
    console.error('Type d\'erreur :', error.name);    
	}

	}

   module.exports = addNewUser;




