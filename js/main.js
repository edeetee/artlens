window.onload = function() {
    var socket = io();

    // lets do some fun
    var title = document.getElementById('title');
    var button = document.getElementById('cameraButton')
    var camera = document.getElementById('video');

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    Webcam.set({
        dest_width: 640,
        dest_height: 480
    });
    Webcam.attach( '#video' );

    button.onclick = takePhoto;

    function takePhoto(){
        //dont do anything while processing
        button.onclick = null;
        
        Webcam.snap(function(uri, canvas, ctx){
            var imageData = ctx.getImageData(0, 0, 640, 480);
            socket.emit('processImage', imageData.data);
            Webcam.freeze();
        });
    }

    function closePhoto(){
        title.innerText = "Click 'Take Photo' to start";
        button.innerText = "Take Photo"
        //make button take photo again
        button.onclick = takePhoto;

        //clear the overlay
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Webcam.unfreeze();
    }

    //server finished processing
    socket.on('processed', function(data){
        console.log('received data: ', data);
        //found a match, use the data
        if(!data)
            closePhoto();   
        else{
            //set the data
            title.innerText = data.title;

            //make the button close
            button.innerText = "Close photo";
            button.onclick = closePhoto;

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
                        ctx.fillStyle = "green";
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