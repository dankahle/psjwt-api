

module.exports = function(status, message){
  return {status: status, message: message};
}


/*
var util = require('util')

function StatusError(status, message) {
  this.status = status;
  this.message = message;
  Error.call(this)
}
util.inherits(StatusError, Error);

 module.exports = StatusError;
*/


