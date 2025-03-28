

var jwt = require('jsonwebtoken'); 
var config = require('../config'); 



const verifyToken  = async (req, res, next) => {
	
	try {
		

		let token = req.body.token || req.query.token || req.headers['token'];
		console.log( token )
		if (token) {
			// verify secret and checks exp
			jwt.verify(token, config.secret, function (err, currUser) {
				if (err) {
					res.send(err);
				} else {
					// decoded object
					req.currUser = currUser;
					next();
				}
			});
		}
		else {

			res.status(401).send("Invalid Access");
		}
		

} catch (error) {
    res.json({"Error" : true, "Message" : error });

}

};
module.exports=verifyToken;