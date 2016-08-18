//Upgrades pop up menu helper
  Template.strengthen.helpers({
    strengthAmt: function() {
        if(Session.get("started")){
            return GameState.findOne({ userId: Meteor.userId() }).strength.amt;
        }
    },
    endTime: function() {
        return GameState.findOne({ userId: Meteor.userId() }).strength.endTime;
    },
    currTime: function() {
        return GameState.findOne({ userId: Meteor.userId() }).strength.currTime;
    },
    pressed: function() {
        return GameState.findOne({ userId: Meteor.userId() }).strength.pressed;
    },
    timeLeft: function() {
        var strength = GameState.findOne({ userId: Meteor.userId() }).strength;
        var time = Math.floor((strength.endTime - strength.currTime) / 2 );
        var hours  = Math.floor(time / 3600);
        time = time - hours * 3600;
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;
        var finalTime = Blaze._globalHelpers.str_pad_left(hours,'0',2)+':'+Blaze._globalHelpers.str_pad_left(minutes,'0',2)+':'+Blaze._globalHelpers.str_pad_left(seconds,'0',2);
        return finalTime;
    },
    nextTime: function() {
        var time = Math.floor(GameState.findOne({ userId: Meteor.userId() }).strength.nextTime / 2);
        var hours  = Math.floor(time / 3600);
        time = time - hours * 3600;
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;
        var finalTime = Blaze._globalHelpers.str_pad_left(hours,'0',2)+':'+Blaze._globalHelpers.str_pad_left(minutes,'0',2)+':'+Blaze._globalHelpers.str_pad_left(seconds,'0',2);
        return finalTime;

    },
    strengthWhenDone: function() {
        return GameState.findOne({ userId: Meteor.userId() }).strength.strengthWhenDone;
    },
    nextStrengthInc: function() {
        var strength = GameState.findOne({ userId: Meteor.userId() }).strength;
        return strength.nextStrengthInc + strength.amt;
    },
    
    

  });
  //Upgrades events
  Template.strengthen.events({
    'click .workout-button': function () {
        Meteor.call("workout");
    },
    
    
  });