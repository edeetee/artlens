window.onload = function() {
    var socket = io();

    // lets do some fun
    var cameraView = document.getElementById('cameraview');
    var title = document.getElementById('title');
    var button = document.getElementById('cameraButton')
    var camera = document.getElementById('video');
    var info = document.getElementById('infoButton');
    var back = document.getElementById('backButton');
    var titleResult = document.getElementById('titleResult');
    var date = document.getElementById('date');
    var description = document.getElementById('description');
    var tp = document.getElementById('tp');

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
  
    //set widths/heights;
    var height = cameraView.clientHeight;
    var width = height*(640/480);
    
    camera.style.width = width;
    camera.style.height = height;
  
    canvas.style.width = width;
    canvas.style.height = height;
    canvas.width = width;
    canvas.height = height;

    Webcam.set({
        width: width,
        height: height,
        dest_width: 640,
        dest_height: 480
    });
    Webcam.attach( '#video' );
  
    document.getElementById('backButton').style.visibility = "hidden";
  document.getElementById('title').style.visibility = "hidden";
  
    
    button.onclick = takePhoto;

    var progressBar;

    function takePhoto(){
        //dont do anything while processing
        button.onclick = null;
      
        document.getElementById('cameraButton').style.visibility = "hidden";
      
        
        Webcam.snap(function(uri, canvas, ctx){
            var imageData = ctx.getImageData(0, 0, 640, 480);
            socket.emit('processImage', imageData.data);
            Webcam.freeze();
            progressBar = new ProgressBar.Circle('#progress-bar', {
                strokeWidth: 10,
                easing: 'easeInOut',
                color: 'white',
                duration: 500,
                text: { 
                    value: "Uploading",
                    autoStyleContainer: false
                }
            });
        });
      document.getElementById('title').style.visibility = "visible";
    }

    function closePhoto(){
//      document.getElementById('title').style.visibility = "hidden";
//        title.innerText = "";
        titleResult.innerHTML = "";
        date.innerHTML = "";
        description.innerHTML = "";
        tp.innerHTML = "";
    //        button.innerText = "Take Photo"
      
        //make button take photo again
        button.onclick = takePhoto;
        document.getElementById('infoButton').style.visibility = "visible";
        document.getElementById('backButton').style.visibility = "hidden";
        document.getElementById('title').style.visibility = "hidden";
        document.getElementById('title').style.bottom = "-480px";
        document.getElementById('title').style.overflow = "hidden";
      
      document.getElementById('cameraButton').style.visibility = "visible";

        //clear the overlay
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Webcam.unfreeze();
    }

    socket.on('started', function(){
        progressBar.setText('Processing')
    });

    socket.on('progress', function(progress){
        progressBar.animate(progress);
    })

    //server finished processing
    socket.on('finished', function(data){
        console.log('received data: ', data);
        //found a match, use the data

        progressBar.destroy();

        if(!data)
            closePhoto();   
        else{
            //set the data
          
              titleResult.innerHTML = data.record.title;
              date.innerHTML = data.record.display_date;
              description.innerHTML = data.record.description;
              tp.innerHTML = data.record.display_collection;

            //make the button close
//            button.innerText = "Close photo";
            document.getElementById('backButton').style.visibility = "visible";
            document.getElementById('infoButton').style.visibility = "hidden";
          
            back.onclick = closePhoto;
            

            ctx.scale(canvas.width/640, canvas.height/480);
            
            //draw the data
            if(data.box){
                ctx.strokeStyle = "white";
                ctx.beginPath();
                ctx.moveTo(data.box[0].x,data.box[0].y);
                ctx.lineTo(data.box[1].x,data.box[1].y);
                ctx.lineTo(data.box[2].x,data.box[2].y);
                ctx.lineTo(data.box[3].x,data.box[3].y);
                ctx.lineTo(data.box[0].x,data.box[0].y);
                ctx.lineWidth=4;
                ctx.stroke();
            }

            //draw the matched points
            if(data.points){
                data.points.forEach(function(val){
                    if(val.correct) {
                        ctx.fillStyle = "white";
                    } else {
                        ctx.fillStyle = "red";
                    }
                    ctx.fillRect(val.x-1,val.y-1,3,3);
                    ctx.stroke();
                })
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    })
}