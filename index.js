var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var passport = require('passport');

var createSendToken = require('./services/jwt.js').createSendToken;
var googleAuth = require('./services/googleAuth.js');
var facebookAuth = require('./services/facebookAuth.js');
var localStrategy = require('./services/localStrategy.js');
var jobs = require('./services/jobs.js');
var emailVerification = require('./services/emailVerification.js');
var apiErrorHandler = require('api-error-handler')
var logger = require('morgan'),
	cors = require('cors')

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

app.get('/jobs', ensureAuthenticated, function(req, res) {
	res.send([
		'Cook',
		'SuperHero',
		'Unicorn Wisperer',
		'Toast Inspector'
	]);
});

app.post('/auth/google', googleAuth);

mongoose.connect('mongodb://localhost/psjwt');


app.use(function(req, res, next) {
	res.status
})
app.use(apiErrorHandler)

function ensureAuthenticated(req, res, next) {
	var authHeaders  = req.headers.authorization && req.headers.authorization.split(' ')
	if(!authHeaders || authHeaders.length < 2)
		return res.status(401).json({message: 'Unauthorized'})

	var token = authHeaders[1];
	var payload = jwt.decode(token, "shhh..");

	if (!payload.sub)
		return res.status(401).json({message: 'Authentication failed'})

	if (!req.headers.authorization)
		return res.status(401).json({message: 'You are not authorized'})

	next();
};

var server = app.listen(1337, function () {
	console.log('api listening on ', server.address().port);
});