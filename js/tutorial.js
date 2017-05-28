var tour;

    tour = new Shepherd.Tour({
        defaults: {
            classes: 'shepherd-theme-dark',
            /*scrollTo: true*/
        }
    });

    tour.addStep('Language', { 
        text: 'Choose language',
        attachTo: '#languageButton left',
        buttons: [
            {
                text: 'Next',
                action: tour.next,

                
            }, {
                text: 'Skip',
                action: function() {
                return tour.hide();
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
                return tour.hide();
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
                return tour.hide();
              }
            }
        ]
    });

    tour.addStep('Tutorial', { 
        text: 'Tap again to repeat the tour',
        attachTo: '#infoButton right',
        buttons: [
             {
                text: 'Done!',
                action: function() {
                return tour.complete();
              }
            }
        ]
    });


function startTour() {
    tour.start(); 

}