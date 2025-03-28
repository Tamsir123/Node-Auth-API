
var mysql   = require("mysql2");
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken'); 
var config = require('../config');
var connection = require("../database");
  

const userLoginCheck  = async (req, res, next) => {

	try {
		

	let post  = {
		password:req.body.password,
		email:req.body.email
	}


	let query = "SELECT * FROM ?? WHERE ??=? AND useractive = 1"; 

	let table = ["utilisateurs", "email", post.email];

	query = mysql.format(query,table);


	connection.query( query, async (err, rows) => {
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query " + err});
		}


		if (rows.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        let user = rows[0]; // Récupère l'utilisateur
        let hashStored = user.password; // Hash enregistré en base de données

        // 2️⃣ Comparer le mot de passe entré avec le hash stocké
        let isMatch = await bcrypt.compare(post.password, hashStored);

        if (!isMatch) {
            return res.status(401).json({"Error" : true, "Message" : "Email ou mot de passe incorrect"});
        }


		let token = jwt.sign( JSON.stringify(rows) , config.secret);   
	     email =rows[0].email

	   let data  = {
		   user_id:rows[0].user_id,
		   access_token:token,
		   
	   }

   

	   let query = "INSERT INTO  ?? SET  ?";
	   let table = ["access_token"];
	   query = mysql.format(query,table);
	   connection.query(query, data, function(err,rows){
		   if(err) {
			   res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		   } else {
			   res.json({
				   success: true,
				   currUser: data.user_id,
				   email: email,
				   message: 'Token generated',
				   token: token,
				   
			   });
				   }
				  });

		
	});


} catch (error) {
    res.json({"Error" : true, "Message" : error });

}

}

module.exports = userLoginCheck;

