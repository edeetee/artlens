//WRITE YOUR SSL IP HOST HERE
//var address = "edeetee.ddns.net"
var address = "artlens.herokuapp.com"
var port = process.env.PORT||80;

var path = require('path');
var express = require('express');

var app = express();

var server = app.listen(port);

var includedFolders = [
	'css',
	'js'
]

var io = require('socket.io').listen(server);

var wrax = require('./stolen.js');
wrax.init();

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

includedFolders.forEach(function(folder){
	app.use('/'+folder, express.static(folder));
})

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('processImage', function(imageData){
    socket.emit('processed', wrax.match(imageData));
    socket.emit('requestImage');
  })

  setTimeout(function(){
     socket.emit('requestImage');
  }, 1000)
});

server.once('listening', function(){
  console.log('listening on port ' + port)
})