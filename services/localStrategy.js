var User = require('../models/User.js');
var LocalStrategy = require('passport-local').Strategy;

var strategyOptions = {
	usernameField: 'email'
};

exports.login = new LocalStrategy(strategyOptions, function (email, password, done) {

	var searchUser = {
		email: email
	};

	User.findOne(searchUser, function (err, user) {
		if (err) return done(err);

		if (!user) return done(null, false, {
			message: 'Wrong email/password'
		});

		user.comparePasswords(password, function (err, isMatch) {
			if (err) return done(err);

			if (!isMatch) return done(null, false, {
				message: 'Wrong email/password'
			});

			return done(null, user);
		});
	})
});

/*
I don't like this (reusing login code for register) as there's no access to req.body so how to
create a new user with more properties than just username/pass? Can't be done. This needs to happen
in /register so it can get the body
 */
exports.register = new LocalStrategy(strategyOptions, function (email, password, done) {

	var searchUser = {
		email: email
	};

	User.findOne(searchUser, function (err, user) {
		if (err) return done(err);

		if (user) return done(null, false, {
			message: 'email already exists'
		});

		var newUser = new User({
			email: email,
			password: password
		});

		newUser.save(function (err) {
			done(null, newUser);
		})
	});
});