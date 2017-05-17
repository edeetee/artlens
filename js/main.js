window.onload = function() {
    var socket = io();

    // lets do some fun
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var title = document.getElementById('title');

    var ctx = canvas.getContext('2d');
        
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
	    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
	        video.src = window.URL.createObjectURL(stream);
        });

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    var boxData;
    var pointsData;

    //server requests an image
    socket.on('requestImage', function(){
        //draw image onto canvas
        ctx.drawImage(video, 0, 0, 640, 480);
        //get data
        var imageData = ctx.getImageData(0, 0, 640, 480);
        //redraw dots etc on canvas
        draw();
        //send data to server
        socket.emit('processImage', imageData.data);
    });

    //server finished processing
    socket.on('processed', function(data){
        console.log('received data: ', data);
        //found a match, use the data
        if(data){
            boxData = data.box;
            pointsData = data.points;
            title.innerText = data.title;
        } else{
            boxData = null;
            pointsData = null;
            title.innerText = "No match found";
        }
        //redraw canvas with new data
        draw();
    })
    
    window.onunload = function() {
        video.pause();
        video.src=null;
    };
}