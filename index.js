//WRITE YOUR SSL IP HOST HERE
var address = "130.195.44.97"

var httpPort = 8080;
var httpsPort = 8081;

var app = require('express')();

var ssl = false;

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