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


    tour.addStep('Additional', { 
            text: 'Once your object is found on the database you will be taken to an information screen',
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

/*---------------------------------------------------------*/


var firstTour;

    firstTour = new Shepherd.Tour({
        defaults: {
            classes: 'shepherd-theme-dark',
            /*scrollTo: true*/
        }
    });

    firstTour.addStep('Welcome', { 
        title: 'Welcome to Artlens',
        text: 'Get more from your museum experience. Use your camera to identify more details from exhibited items.',
        attachTo: '#canvas middle',
        buttons: [
            {
                text: 'Begin',
                action: firstTour.next,

                
            }
        ]
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


    firstTour.addStep('Additional', { 
            text: 'Once your object is found on the database you will be taken to another screen',
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
        /*if (!localStorage.getItem('viewed')){*/
           firstTour.start();
            $('#video ').addClass('blur'),
            $('#canvas').addClass('dim');
           /*localStorage.setItem('viewed','yes');
    }*/
    
}


/*---------------------------------------------------------*/


var secondscreenTour;

    secondscreenTour = new Shepherd.Tour({
        defaults: {
            classes: 'shepherd-theme-dark',
            /*scrollTo: true*/
        }
    });

    secondscreenTour.addStep('drag up', { 
        text: 'drag up',
        attachTo: '#titleResult top',
        buttons: [
            {
                text: 'Next',
                action: secondscreenTour.next,

                
            }, {
                text: 'Exit',
                action: function() {
                return secondscreenTour.hide(),
                $('#canvas').removeClass('dim'),
                $('#video ').removeClass('blur');
              }
            }
        ]
    });


    secondscreenTour.addStep('back button', { 
        text: 'Go back to the camera.',
        attachTo: '#backButton bottom',
        buttons: [
            {
                text: 'Done!',
                action: function() {
                return secondscreenTour.complete(),
                $('#canvas').removeClass('dim'),
                $('#video ').removeClass('blur');

                }
            }
        ]
    });


function startsecondscreenTour(){
       
    if (!localStorage.getItem('viewed')){
        if($('#infoButton').is(':hidden')){
                secondscreenTour().start(),
                $('#video ').addClass('blur'),
                $('#canvas').addClass('dim');
        }
    localStorage.setItem('viewed','yes');
    }
}

