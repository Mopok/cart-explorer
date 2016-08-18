//Upgrades pop up menu helper
  Template.upgrades.helpers({
    animals: function() {
        if(Session.get("started")){
            return GameState.findOne({ userId: Meteor.userId() }).upgrades;
        }
    },
    netsNeeded: function(animal) {
        if(Session.get("started")){
            if(animal.netCost > 99999){
                return animal.netCost.toExponential(2).toString();
            } else {
                return animal.netCost.toString();
            }
        }
    },
    amountOfAnimals: function(animal) {
        if(Session.get("started")){
            return animal.amount.toString();
        }
    },
    //Biome should be synced with currBiome
    biome: function(animal) {
        return Blaze._globalHelpers.biome(animal.biome);
    },
    //Checks if animal is unlocked
    unlocked: function(animal) {
        return animal.biome < GameState.findOne({ userId: Meteor.userId() }).meters;
    },
    nets: function() {
        var nets = GameState.findOne({ userId: Meteor.userId() }).nets;
        if(Session.get("started")){
            if(GameState.findOne({ userId: Meteor.userId() }) == null){
                return 0;
            } else if(nets > 99999) {
                return nets.toExponential(2);
            } else {
                return Math.floor(nets);
            }
        }
    },
    isPush: function() {
        return Session.get("autoAssign").key == "upgrades.$.amtPushing";
    },
    isCraft: function() {
        return Session.get("autoAssign").key == "upgrades.$.amtCrafting";
    },
    isMingle: function() {
        return Session.get("autoAssign").key == "upgrades.$.mingling";
    }

  });
  //Upgrades events
  Template.upgrades.events({
    'click .upgrade-button': function () {
        Meteor.call("upgrade", this, Session.get("autoAssign"));
    },
    'click .close-upgrades': function () {
        Session.set("upgradeMenu", false);
    },
    'click .radio-craft': function () {
        Session.set('autoAssign', {key: "upgrades.$.amtCrafting", value: "netVel"});
    },
    'click .radio-push': function () {
        Session.set('autoAssign', {key: "upgrades.$.amtPushing", value: "meterVel"});
    },
    'click .radio-mingle': function () {
        Session.set('autoAssign', {key: "upgrades.$.mingling", value: null});
    },
    
  });