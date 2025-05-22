var express = require("express");
var mysql   = require("mysql");
var cors = require('cors');
var bodyParser  = require("body-parser");



var verifyToken = require('./middleware/verifyToken');
var addNewUser = require('./middleware/addNewUser');
var userLoginCheck = require('./middleware/userLoginCheck');
var UserOne = require('./middleware/UserOne');
var updateUser = require('./middleware/updateUser');
var deleteUser = require('./middleware/deleteUser');

var welcome = require('./middleware/welcome');
var Utilisateur = require('./middleware/Data/Utilisateur');


const port = process.env.PORT || 4400;   

  
////  Routes  principales  

var app  = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', welcome);
app.post('/signup', addNewUser);
app.post('/userlogin', userLoginCheck);
app.get('/Utilisateur', Utilisateur);


////  Sous-Routes avec Token

var apiRoutes = express.Router();
apiRoutes.use(bodyParser.urlencoded({ extended: true }));
apiRoutes.use(bodyParser.json());

apiRoutes.use(verifyToken);
apiRoutes.get('/Utilisateur', Utilisateur);
apiRoutes.get('/UserOne/:id', UserOne);
apiRoutes.put('/updateUser/:id', updateUser);
apiRoutes.delete('/deleteUser/:id', deleteUser);


app.use('/api', apiRoutes);


app.listen( port , () => {
    console.log('Démarrage et écoute sur le port  ' +port);
});
