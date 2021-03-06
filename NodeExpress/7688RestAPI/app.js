var port = 8080;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var basic_auth = require('basic-auth');
var helmet = require('helmet');
var config = require('config');
var authInfo = config.get('BasicAuth');
// console.log(authInfo);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(helmet());

var do_auth = function(req, res, next) {
  //TODO: put time constraint
  
  var credentials = basic_auth(req);
  // console.log(req.body);
  // console.log(credentials);
  // console.log(req.get('Content-Type'));
  // console.log(req.get('Authorization'));
  if (!credentials || credentials.name !== authInfo.ID || credentials.pass !== authInfo.PASS) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="ID and Password"');
    res.end('Access denied');
  } else {
    next();
  }
};

app.all('*', do_auth);

//TODO: use common handlers and for each device, create its own config.
var motors = require('./motors');
app.use('/motors', motors);

app.listen(port, function () {
  console.log('7688 app listening on port ' + port);
});