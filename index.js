
//WRITE YOUR IP HOST HERE
var address = "192.168.1.7";

var express = require('express');
var app = express();

var createServer = require("auto-sni");
var server = createServer({
    email: "edeetee@gmail.com",
    agreeTos: true,
    debug: true,
    domains: [address]
}, app);

var io = require('socket.io').listen(server);

var wrax = require('./stolen.js');
wrax.init();

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static('scripts'));

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('processImage', function(imageData){
    var info = wrax.match(imageData);
    socket.emit('points', info.points);
    socket.emit('boundingBox', info.box);

    socket.emit('requestImage');
  })

  setTimeout(function(){
     socket.emit('requestImage');
  }, 1000)
});

server.once('listening', function(){
    console.log("listening on " + address);
})