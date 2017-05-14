//WRITE YOUR SSL IP HOST HERE
var address = "192.168.1.7"

var httpPort = 8080;
var httpsPort = 443;

var express = require('express');
var app = express();

var ssl = false;

var includedFolders = [
	'css',
	'js'
]

if(ssl){
  var server = require("auto-sni")({
      email: "edeetee@gmail.com",
      agreeTos: true,
      debug: true,
      domains: [address],
      ports: {
        http: httpPort,
        https: httpsPort
      }
  }, app);
} else
  var server = app.listen(httpPort);

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