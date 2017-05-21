window.onload = function() {
    var socket = io();

    // lets do some fun
    var title = document.getElementById('title');
    var button = document.getElementById('cameraButton')
    var camera = document.getElementById('my_camera');

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // Webcam.set({
    //     dest_width: 640,
    //     dest_height: 480
    // });
    Webcam.attach( '#my_camera' );

    button.onclick = takePhoto;

    function takePhoto(){
        Webcam.snap(function(){
            var imageData = ctx.getImageData(0, 0, 640, 480);
            socket.emit('processImage', imageData.data);
        }, canvas);
    }

    function closePhoto(){
        if(boxData || pointsData)
            return;
        
        //reset the data
        boxData = null;
        pointsData = null;

        title.innerText = "No match";
        //make button take photo again
        button.onclick = takePhoto;
        //show the camera again
        camera.style.display = 'initial';
        canvas.style.display = 'none';
    }

    var boxData;
    var pointsData;

    //server finished processing
    socket.on('processed', function(data){
        console.log('received data: ', data);
        //found a match, use the data
        if(data){
            //set the data
            boxData = data.box;
            pointsData = data.points;
            title.innerText = data.title;

            button.innerHTML = "Close photo";
            //make the button close
            button.onclick = closePhoto;
            //show the camera snapshot
            camera.style.display = 'none';
            canvas.style.display = 'initial';
            //draw the data
            draw();
        } else
            closePhoto();
    })

    //draw the dots
    function draw(){
        //draw the bounding box
        if(boxData){
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(boxData[0].x,boxData[0].y);
            ctx.lineTo(boxData[1].x,boxData[1].y);
            ctx.lineTo(boxData[2].x,boxData[2].y);
            ctx.lineTo(boxData[3].x,boxData[3].y);
            ctx.lineTo(boxData[0].x,boxData[0].y);
            ctx.lineWidth=4;
            ctx.stroke();
        }

        //draw the matched points
        if(pointsData){
            pointsData.forEach(function(val){
                if(val.correct) {
                    ctx.fillStyle = "green";
                } else {
                    ctx.fillStyle = "red";
                }
                ctx.fillRect(val.x-1,val.y-1,3,3);
                ctx.stroke();
            })
        }
    }
}