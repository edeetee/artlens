var tour;

    tour = new Shepherd.Tour({
        defaults: {
            classes: 'shepherd-theme-dark',
            /*scrollTo: true*/
        }
    });

    tour.addStep('Camera', { 
        text: 'Tap the camera button to capture the object',
        attachTo: '#centerButton top',
        buttons: [
            {
                text: 'Next',
                action: tour.next,

                
            }, {
                text: 'Exit',
                action: function() {
                return tour.hide(),
                $('#canvas').removeClass('dim'),
                $('#video ').removeClass('blur');
              }
            }
        ]
    });


    tour.addStep('Tutorial', { 
        text: 'Tap again to repeat the tour',
        attachTo: '#infoButton right',
        tetherOptions:{ 
            targetAttachment: 'bottom right',
        },
        buttons: [
             {
                text: 'Done!',
                action: function() {
                return tour.complete(),
                $('#canvas').removeClass('dim'),
                $('#video ').removeClass('blur');
              }
            }
        ]
    });


function startTour(){
    tour.start();
    
}


var firstTour;

    firstTour = new Shepherd.Tour({
        defaults: {
            classes: 'shepherd-theme-dark',
            /*scrollTo: true*/
        }
    });

    firstTour.addStep('Camera', { 
        text: 'Tap the camera button to capture the object',
        attachTo: '#centerButton top',
        buttons: [
            {
                text: 'Next',
                action: firstTour.next,

                
            }, {
                text: 'Exit',
                action: function() {
                return firstTour.hide(),
                $('#canvas').removeClass('dim'),
                $('#video ').removeClass('blur');
              }
            }
        ]
    });


    firstTour.addStep('Tutorial', { 
        text: 'Tap again to repeat the tour',
        attachTo: '#infoButton right',
        tetherOptions:{ 
            targetAttachment: 'bottom right',
        },
        buttons: [
             {
                text: 'Done!',
                action: function() {
                return firstTour.complete(),
                $('#canvas').removeClass('dim'),
                $('#video ').removeClass('blur');
              }
            }
        ]
    });


function startfirstTour(){
        if (!localStorage.getItem('viewed')){
           firstTour.start();  
           localStorage.setItem('viewed','yes');
    }
    
}
