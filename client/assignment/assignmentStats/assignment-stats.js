//Assignment-stats helpers
  Template.animalstats.helpers({
    velocity: function() {
        var animal = Session.get("animalTypeStats");
        var velocity = animal.speedInc * animal.amtPushing;
        if(Session.get("started")){
            if(velocity > 99999){
              return velocity.toExponential(2);
            } else {
              return velocity;
            }
        }
    },
    craftSpeed: function() {
        var animal = Session.get("animalTypeStats");
        var craftSpeed = animal.speedInc * animal.amtCrafting;
        if(Session.get("started")){
            if(craftSpeed > 99999) {
              return craftSpeed.toExponential(2);
            } else {
              return craftSpeed;
            }
        }
    },
    velocityPercent: function() {
        if(Session.get("started")){
            //Parameter from session variable
            var vel = GameState.findOne({ userId: Meteor.userId() }).meterVel;
            var animal = Session.get("animalTypeStats");

            return Math.floor(((animal.speedInc * animal.amtPushing) / vel) * 100);
        }
    },
    craftPercent: function() {
        if(Session.get("started")){
            //Parameter from session variable
            var vel = GameState.findOne({ userId: Meteor.userId() }).netVel;
            var animal = Session.get("animalTypeStats");
            var percent = ((animal.speedInc * animal.amtCrafting) / vel) * 100;
            return Math.floor(percent);
        }
    },
    animal: function() {
        if(Session.get("started")){
            var animal = Session.get("animalTypeStats");
            return animal.animalType;
        }
    },
    mingling: function() {
        if(Session.get("started")){
            var animal = Session.get("animalTypeStats");
            return animal.mingling;
        }
    },
    breedingRate: function() {
        if(Session.get("started")){
            var animal = Session.get("animalTypeStats");
            return animal.mingling / 1000;
        }
    },
    speedInc: function() {
       if(Session.get("started")){
            var animal = Session.get("animalTypeStats");
            var velocity = animal.speedInc;
            if(velocity > 99999){
              return velocity.toExponential(2);
            } else {
              return velocity;
            }
        } 
    }
    
  });
  //Assignment-stats Events
  Template.animalstats.events({
    'click .exit-stats': function () {
        Session.set("animalStats", false);
    },
    
  });