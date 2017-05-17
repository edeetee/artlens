//WRITE YOUR SSL IP HOST HERE
//var address = "edeetee.ddns.net"
var address = "artlens.herokuapp.com"
var httpPort = 80;
var httpsPort = 8080;

var ssl = true;


var path = require('path');
var express = require('express');

var app = express();

if(ssl){
  var server = app.listen(httpsPort);

  var httpApp = express();
  httpApp.get('*',function(req,res){  
      res.redirect('https://'+address+req.url + ":" + httpsPort)
  })
  httpApp.listen(httpPort);
} else
  var server = app.listen(httpPort);

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
  if(ssl)
    console.log("listening on " + address + ' on http:' + httpPort + ' and https:' + httpsPort)
  else
    console.log('listening on localhost on http:' + httpPort)
})