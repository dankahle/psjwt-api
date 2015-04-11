var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var passport = require('passport');

var createSendToken = require('./services/jwt.js').createSendToken;
var googleAuth = require('./services/googleAuth.js');
var facebookAuth = require('./services/facebookAuth.js');
var localStrategy = require('./services/localStrategy.js');
var emailVerification = require('./services/emailVerification.js');
var apiErrorHandler = require('api-error-handler')
var logger = require('morgan'),
	cors = require('cors'),
	Err = require('./err')

mongoose.connect('mongodb://localhost/psjwt');

var app = express();
//app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use('local-register', localStrategy.register);
passport.use('local-login', localStrategy.login);

app.post('/auth/register', passport.authenticate('local-register', {session:false}), function (req, res) {
	//emailVerification.send(req.user.email);
	createSendToken(req.user, res);
});

app.get('/auth/verifyEmail', emailVerification.handler);

app.post('/auth/login', passport.authenticate('local-login', {session:false}), function (req, res) {
	createSendToken(req.user, res);
});

app.post('/auth/facebook', facebookAuth);
app.post('/auth/google', googleAuth);

app.get('/jobs', ensureAuthenticated, function(req, res) {
	res.send(['job1', 'job2']);
});

function ensureAuthenticated(req, res, next) {
	var authHeaders  = req.headers.authorization && req.headers.authorization.split(' ')
	if(!authHeaders || authHeaders.length < 2)
		return next(Err(401, 'Unauthorized'))

	var token = authHeaders[1];
	var payload = jwt.decode(token, "shhh..");

	if (!payload.sub)
		return next(Err(401, 'Authentication failed'))

	if (!req.headers.authorization)
		return next(Err(401, 'You are not authorized'))

	next();
};

app.use(function(req, res) {
	next(Err(404, 'Not Found'))
})
app.use(apiErrorHandler())

var server = app.listen(1337, function () {
	console.log('api listening on ', server.address().port);
});