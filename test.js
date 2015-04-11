
var express = require('express'),
  app = express(),
  Err = require('./statusError'),
  aeh = require('api-error-handler')

app.use(function(req, res, next) {
  //next({status:422, message:'two'})
  //res.send('here')
  next( 'anything')
  //throw new Error('shit')
  console.log('after')
})
app.use(function(err, req, res, next) {
  console.log(err instanceof Error, err)
})
app.use(aeh())

app.listen(3000, function() { console.log('listening on 3000')})