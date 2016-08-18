//Assignment helpers
  Template.assignments.helpers({
    animals: function() {
        if(Session.get("started")){
            return GameState.findOne({ userId: Meteor.userId() }).upgrades;
        }
    },
    //Shows amount of animals idling
    mingling: function(animal) {
        if(Session.get("started")){
            return animal.mingling;
        }
    },
    //Checks if animal is unlocked
    unlocked: function(animal) {
        return animal.biome < GameState.findOne({ userId: Meteor.userId() }).meters;
    },
    velocity: function() {
        var velocity = GameState.findOne({ userId: Meteor.userId() }).meterVel;
        if(Session.get("started")){
            if(velocity > 99999){
              return velocity.toExponential(2);
            } else {
              return velocity;
            }
        }
    },
    craftSpeed: function() {
        var craftSpeed =  GameState.findOne({ userId: Meteor.userId() }).netVel;
        if(Session.get("started")){
            if(craftSpeed > 99999) {
              return craftSpeed.toExponential(2);
            } else {
              return craftSpeed;
            }
        }
    },
    animalStats: function() {
        return Session.get("animalStats");
    },
    isOne: function() {
        return Session.get("incrementAmt") == 1;
    },
    isTen: function() {
        return Session.get("incrementAmt") == 10;
    },
    isHundred: function() {
        return Session.get("incrementAmt") == 100;
    },
    isThousand: function() {
        return Session.get("incrementAmt") == 1000;
    },
  });
  //Assignment Events
  Template.assignments.events({
    'click .push-dec-button': function () {
        var incrementAmt = Session.get("incrementAmt");
        Meteor.call("decPush", this, incrementAmt);
    },
    'click .push-inc-button': function () {
        var incrementAmt = Session.get("incrementAmt");
        Meteor.call("incPush", this, incrementAmt);
    },
    'click .craft-dec-button': function () {
        var incrementAmt = Session.get("incrementAmt");
        Meteor.call("decCraft", this, incrementAmt);
    },
    'click .craft-inc-button': function () {
        var incrementAmt = Session.get("incrementAmt");
        Meteor.call("incCraft", this, incrementAmt);
    },
    'click .stats-button': function () {
        Session.set("animalStats", !Session.get("animalStats"));
        Session.set("animalTypeStats", this);
    },
    'click .radio-one': function () {
        Session.set('incrementAmt', 1);
    },
    'click .radio-ten': function () {
        Session.set('incrementAmt', 10);
    },
    'click .radio-hundred': function () {
        Session.set('incrementAmt', 100);
    },
    'click .radio-thousand': function () {
        Session.set('incrementAmt', 1000);
    },
  });