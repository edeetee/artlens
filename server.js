//WRITE YOUR SSL IP HOST HERE
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


//receive photo
io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('processImage', function(imageData){
    socket.emit('processed', wrax.match(imageData));
  })
});

server.once('listening', function(){
  console.log('listening on port ' + port)
})