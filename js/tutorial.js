var tour;

    tour = new Shepherd.Tour({
        defaults: {
            classes: 'shepherd-theme-dark',
            /*scrollTo: true*/
        }
    });

    tour.addStep('Language', { 
        text: 'Choose your language',
        attachTo: '.goog-te-gadget-simple bottom',
        tetherOptions:{ 
            targetAttachment: 'bottom center',
            offset: '0px 20px'
        },
        buttons: [
            {
                text: 'Next',
                action: tour.next,

                
            }, {
                text: 'Skip',
                action: function() {
                return tour.hide(),
                $('#canvas').removeClass('dim'),
                $('#video ').removeClass('blur');
              }
            }
        ]
    });

    tour.addStep('Camera', { 
        text: 'Tap the camera button to capture the object',
        attachTo: '#centerButton top',
        buttons: [
            {
                text: 'Next',
                action: tour.next,

                
            }, {
                text: 'Skip',
                action: function() {
                return tour.hide(),
                $('#canvas').removeClass('dim'),
                $('#video ').removeClass('blur');
              }
            }
        ]
    });

    tour.addStep('Info', { 
        text: 'Drag up to view the details',
        attachTo: '#title top',
        buttons: [
            {
                text: 'Next',
                action: tour.next,

                
            }, {
                text: 'Skip',
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


function startTour() {
    tour.start(); 

}

