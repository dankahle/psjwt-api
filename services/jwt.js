var jwt = require('jwt-simple');
var moment = require('moment');

function createSendToken(user, res) {

	res.status(200).send({
		user: user.toJSON(),
		token: encode(user)
	});
}

function encode(user) {
	var payload = {
		sub: user.id,
		exp: moment().add(10, 'days').unix()
	}

	return jwt.encode(payload, "shhh..");
}

function decode(token) {
	return jwt.decode(token, "shhh..")
}

module.exports = {
	createSendToken: createSendToken,
	encode: encode,
	decode: decode
}