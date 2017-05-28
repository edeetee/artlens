// change to your preferred port
var port = process.env.PORT||80;

var includedFolders = [
	'css',
	'js'

]

var path = require('path');
var express = require('express');
var request = require('ajax-request');
var wrax = require('./stolen.js');
var sharp = require('sharp');

var io = require('socket.io').listen(server);
var app = express();
var server = app.listen(port);

var pages = 1;
var per_page = 50;
for(var i = 1; i <= pages; i++){
  request({
    url: "http://api.digitalnz.org/v3/records.json",
    json: true,
    data: {
      api_key: '_Yuwd93tskTvvgWftRLz',
      "and[primary_collection][]": "Te Papa Collections Online",
      "and[dc_type][]": "Physical Object",
      "or[collection][]": [
        "History Collection",
        "Archives - Museum Collection",
        "Art Collection"
      ],
      "without[usage][]": "All rights reserved",
      "without[description][]": "Unknown",
      page: i,
      per_page: per_page,
      fields: "id,title,landing_url,large_thumbnail_url,dc_type,creator,description,tag"
    }
  }, searchRequestCallback);
}

var finishedRequests = 0;
var successfulRequests = 0;

function searchRequestCallback(err, res, body){
  if(err){
    console.log("search request failed: " + err);
  } else{
    body.search.results.forEach(function(result){
      request.download({
        url: result.large_thumbnail_url,
        destPath: "tempimages/" + result.id + ".jpg"
      }, function(err, res, body, destPath){
        sharp(path.join(__dirname,destPath))
          .resize(640, 480)
          .crop(sharp.strategy.entropy)
          .min()
          .toFile(path.join(__dirname, "images", result.id + ".png"), function(err, info){
            finishedRequests++;
            if(!err){
              successfulRequests++;
            }
            console.log('succeeded: ' + successfulRequests + ', attempted: ' + finishedRequests + ', of total: ' + pages*per_page);
            if(finishedRequests == pages*per_page)
              wrax.init();
          });
      });
    });
  }
}

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