const express = require('express');
var path = require('path');
require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: externalUrl || `https://localhost:${port}`,
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

if (externalUrl) {
  const hostname = '127.0.0.1';
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
    outside on ${externalUrl}`);
  });
}
else {
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
    }, app)
    .listen(port, function () {
    console.log(`Server running at https://localhost:${port}/`);
    });
}

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
