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

var app = express();
var server = app.listen(port);
var io = require('socket.io').listen(server);

var requestOptions = {
    url: "http://api.digitalnz.org/v3/records.json",
    json: true,
    data: {
      api_key: '_Yuwd93tskTvvgWftRLz',
      "and[primary_collection][]": "Te Papa Collections Online",
      // "and[dc_type][]": "Physical Object",
      "or[collection][]": [
        "History Collection",
        "Archives - Museum Collection",
        "Art Collection"
      ],
      "without[usage][]": "All rights reserved",
      "without[dc_type][]": [
        "Still Image",
        "transparencies",
        "landscapes",
        "letters",
        "works on paper"
      ],
      sort: "syndication_date",
      page: 1,
      per_page: 50,
      fields: "id,large_thumbnail_url,description"
    }
  };

var quota = 20;
var finishedRequests = 0;
var successfulRequests = 0;

request(requestOptions, requestCallback);

function requestCallback(err, res, body){
  //increment page counter
  if(err){
    console.log("search request failed: " + err);
  } else {
    body.search.results.forEach(function(result){
      if(result.description != null && result.description != "Unknown"){
        var saveLocation = "tempimages/" + result.id + ".jpg";
        request.download({
          url: result.large_thumbnail_url,
          destPath: saveLocation
        }, function(err, res, body, destPath){
          sharp(path.join(__dirname,saveLocation))
            .resize(640, 480)
            .embed()
            .toFile(path.join(__dirname, "images", result.id + ".png"), function(err, info){
              processedCallback(err == null);
            });
        });
      } else
        processedCallback(false);
    });
  }
}

function hasLoaded(){

}

function processedCallback(succeeded){
  finishedRequests++;
  if(succeeded){
    successfulRequests++;
  }

  if(finishedRequests == requestOptions.data.per_page*requestOptions.data.page){
    requestOptions.data.page++;
    console.log('processed ' + successfulRequests + '/' + quota + ' images after ' + finishedRequests + ' attempts');

    if(successfulRequests < quota)
      request(requestOptions, requestCallback);
    else{
      wrax.init(function(count){
        console.log('parsed ' + count + ' images. READY');
        started = true;
      });
    }
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

      var data = wrax.match(imageData, function(progress){
        socket.emit('progress', progress);
      });
      if(data)
        request({
          url: 'http://api.digitalnz.org/v3/records/' + data.id + '.json',
          json: true,
          data: {
            api_key: "_Yuwd93tskTvvgWftRLz"
          }
        }, function(err, res, body){
          if(err){
            console.log(err);
            socket.emit('finished', null);
          } else{
            data.record = body.record;
            console.log('MATCH: ' + data.record.title + ' (' + data.id + ')');
            socket.emit('finished', data);
          }
        })
      else
        socket.emit('finished', null);
    }else{
      console.log("loading hasn't finished, emitting 'finished' to client")
      socket.emit('finished');
    }
  })
});