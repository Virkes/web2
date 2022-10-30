const express = require('express');
var path = require('path');
require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};

app.use(auth(config));
app.use(cors())

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () =>{
  console.log(`listening on port ${port}`);
});

app.get('/', (req, res) => {
    let isAuth = req.oidc.isAuthenticated()
    let loggedIn = req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out';
    res.render('index', {
      isAuthenticated: isAuth,
      loggedIn: loggedIn
    });
});


const utakmicaRoute = require('./routes/utakmice');
const komentariRoute = require('./routes/komentari')
app.use('/utakmice', utakmicaRoute);
app.use('/komentari', komentariRoute)

module.exports = app;
