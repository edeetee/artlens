// change to your preferred port
var port = process.env.PORT||80;

var includedFolders = [
	'css',
	'js'

]

var path = require('path');
var express = require('express');
var request = require('ajax-request');

var app = express();

var server = app.listen(port);

var io = require('socket.io').listen(server);

var wrax = require('./stolen.js');

//http://api.digitalnz.org/v3/records.json?api_key=_Yuwd93tskTvvgWftRLz&and[primary_collection][]=Te%20Papa%20Collections%20Online&without[collection][]=Plants%20Collection&without[collection][]=Molluscs%20Collection&without[usage][]=All%20rights%20reserved&and[dc_type][]=Physical%20Object&page=1&sort=date

request({
  url: "http://api.digitalnz.org/v3/records.json",
  json: true,
  data: {
    api_key: '_Yuwd93tskTvvgWftRLz',
    and: [
      "[primary_collection][]=Te Papa Collections Online",
      "[dc_type][]=Physical Object"
    ],
    or: [
      "[collection][]=History Collection",
      "[collection][]=Archives - Museum Collection",
      "[collection][]=Art Collection"
    ],
    without: [
      "[usage][]=All rights reserved",
      "[description][]=Unknown"
    ],
    page: "1",
    fields: "id,title,landing_url,large_thumbnail_url,dc_type,creator,description,tag"
  }
}, function(err, res, body){
  
})

//page loading shit
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https' && process.env.HEROKU)
    return res.redirect(['https://', req.get('Host'), req.url].join(''))
  else
    return next() /* Continue to other routes if we're not redirecting */
})
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
includedFolders.forEach(function(folder){
	app.use('/'+folder, express.static(folder));
})
server.once('listening', function(){
  console.log('listening on port ' + port)
})


//request stuff
var started = false;
//receive photo
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('processImage', function(imageData){
    if(started){
      socket.emit('started');
      socket.emit('finished', wrax.match(imageData, function(progress){
        socket.emit('progress', progress);
      }));
    }else{
      console.log("loading hasn't finished, emitting 'finished' to client")
      socket.emit('finished');
    }
  })
});