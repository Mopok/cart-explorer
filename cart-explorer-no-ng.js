GameState = new Mongo.Collection("gameStates");//server side collection
CrossBreed = new Mongo.Collection("crossBreeds")//Server collection of crossBreeds

if (Meteor.isClient) {
  //Clears session vars if someone logs out
  var userWasLoggedIn = false;
  var idleInterval;
  var breedInterval;
  var crossBreedInterval;
  var strengthInterval;
  Deps.autorun(function (c) {
      if(!Meteor.userId()) {
          if(userWasLoggedIn) {
              Session.set('started', false);
              Session.set('upgradeMenu', false);
              Session.set('assignmentMenu', false);
              Session.set('animalStats', false);
              Session.set('animalTypeStats', {});
              Session.set('autoAssign', {key: "upgrades.$.amtPushing", value: "meterVel"});
              Session.set('incrementAmt', 1);
              Meteor.clearInterval(idleInterval);
              Meteor.clearInterval(breedInterval);
              Meteor.clearInterval(crossBreedInterval);
              Meteor.clearInterval(strengthInterval);
          }
      } else {
          userWasLoggedIn = true;
      }
  });


  Meteor.subscribe("gameStates");
  Meteor.subscribe("crossBreeds");

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Session.setDefault('started', false);
  Session.setDefault('upgradeMenu', false);
  Session.setDefault('assignmentMenu', false);
  Session.setDefault('animalStats', false);
  Session.setDefault('animalTypeStats', {});
  Session.setDefault('autoAssign', {key: "upgrades.$.amtPushing", value: "meterVel"});
  Session.setDefault('incrementAmt', 1);
  Session.setDefault('enhanceMenu', false);
  Session.setDefault('strengthMenu', false);
  Session.setDefault('themeMenu', false);
  //Unsafe place, will move
  Session.setDefault('interval', 0.5);

  //body helpers
  Template.body.helpers({
    started: function () {
      return Session.get('started');
    },
    headerTxt: function () {
      if(Session.get("started")) {
        return Blaze._globalHelpers.biome(GameState.findOne({ userId: Meteor.userId() }).meters);
      } else {
        return "Cart Explorer";
      }
    },
  });
  Template.registerHelper('biomeDomain',function(biome){
    //Given a biome
    //Returns the meters the biome's maximum is at
    switch(true) {
            case (biome == "beach"): //4000
                return 4000;
            case (biome == "grasslands"): //64000
                return 64000;
            case (biome == "swamps"): //2048000
                return 2048000;
            case (biome == "mountains"): //10000000 
                return 10000000;
            case (biome == "forest"): //50000000 
                return 50000000;
            case (biome == "glacier"): //350000000 
                return 350000000;
            default:
                return -1;
    }
  

  });
  Template.registerHelper('biome',function(arg){
    if(Session.get("started")) {
        switch(true) {
            case (arg < Blaze._globalHelpers.biomeDomain("beach")): 
                return "Beach";
            case (arg >= Blaze._globalHelpers.biomeDomain("beach") && arg < Blaze._globalHelpers.biomeDomain("grasslands")):
                return "Grasslands";
            case (arg >= Blaze._globalHelpers.biomeDomain("grasslands") && arg < Blaze._globalHelpers.biomeDomain("swamps")):
                return "Swamps";
            case (arg >= Blaze._globalHelpers.biomeDomain("swamps") && arg < Blaze._globalHelpers.biomeDomain("mountains")):
                return "Mountains"
            case (arg >= Blaze._globalHelpers.biomeDomain("mountains") && arg < Blaze._globalHelpers.biomeDomain("forest")):
                return "Forest"
            case (arg >= Blaze._globalHelpers.biomeDomain("forest") && arg < Blaze._globalHelpers.biomeDomain("glacier")):
                return "Glacier"
            default:
                return "No Biome";
        }
    }
  });
  Template.registerHelper('str_pad_left', function(string, pad, length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
  });
  Template.registerHelper('selectedStyle', function() {
    if(GameState.findOne({ userId: Meteor.userId() }).selectedTheme == "default"){
      var biome = Blaze._globalHelpers.biome(GameState.findOne({ userId: Meteor.userId() }).meters);
      biome = "/biomestyles/" + biome.toLowerCase() + ".css";   
    } else {
      biome = "/biomestyles/" + GameState.findOne({ userId: Meteor.userId() }).selectedTheme + ".css";
    }
    return biome;
      
  });

  //gameBox helpers
  Template.gameBox.helpers({
    meters: function() {
      var meters = GameState.findOne({ userId: Meteor.userId() }).meters;
        if(Session.get("started")){
            if(GameState.findOne({ userId: Meteor.userId() }) == null){
                return 0;
            } else if(meters > 99999) {
              return meters.toExponential(2);
            } else {
              return Math.floor(meters);
            }
        }
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
    strength: function() {
        if(Session.get("started")){
            if(GameState.findOne({ userId: Meteor.userId() }) == null){
                return 0;
            } else {
                return GameState.findOne({ userId: Meteor.userId() }).strength;
            }
        }
    },
    unlocked: function(animal) {
        return animal.biome > GameState.findOne({ userId: Meteor.userId() }).meters;
    },
    currBiome: function() {
        var currPos = GameState.findOne({ userId: Meteor.userId() }).meters;
        return Blaze._globalHelpers.biome(currPos);
    },
    velocity: function() {
        var velocity = GameState.findOne({ userId: Meteor.userId() }).meterVel;
        if(Session.get("started")){
            if(velocity > 99999){
              return velocity.toExponential(2);
            } else {
              return Math.floor(velocity);
            }
        }
    },
    craftSpeed: function() {
        var craftSpeed =  GameState.findOne({ userId: Meteor.userId() }).netVel;
        if(Session.get("started")){
            if(craftSpeed > 99999) {
              return craftSpeed.toExponential(2);
            } else {
              return Math.floor(craftSpeed);
            }
        }
    },
    
    
    //Checker to see if upgradeMenu is open
    upgradeMenu: function() {
        return Session.get("upgradeMenu");
    },
    assignmentMenu: function() {
        return Session.get("assignmentMenu");
    },
    strengthMenu: function() {
      return Session.get("strengthMenu");
    },
    enhanceMenu: function() {
      return Session.get("enhanceMenu");
    },
    themeMenu: function() {
      return Session.get("themeMenu");
    },
    upgradeBtnTxt: function() {
      if(Session.get("upgradeMenu")){
        return "Close";
      } else {
        return "Capture";
      }
    },
    assignBtnTxt: function() {
      if(Session.get("assignmentMenu")){
        return "Close";
      } else {
        return "Assign";
      }
    },
    strengthBtnTxt: function() {
      if(Session.get("strengthMenu")){
        return "Close";
      } else {
        return "Strength";
      }
    },
    enhanceBtnTxt: function() {
      if(Session.get("enhanceMenu")){
        return "Close";
      } else {
        return "Enhance";
      }
    },
    themeBtnTxt: function() {
      if(Session.get("themeMenu")){
        return "Close";
      } else {
        return "Select Theme";
      }
    },
    
  });


  //gameBox events
  Template.gameBox.events({
    'click .meter-button': function () {
      Meteor.call("incMeters");
    },
    'click .craft-button': function () {
      Meteor.call("incNets");
    },
    'click .strength-button': function () {
      Meteor.call("incStrength");
    },
    
    'click .upgrade-menu-button': function () {
        Session.set("upgradeMenu", !Session.get("upgradeMenu"));
        Session.set("assignmentMenu", false);
        Session.set("animalStats", false);
        Session.set("strengthMenu", false);
        Session.set("enhanceMenu", false);
        Session.set("themeMenu", false);
    },
    'click .assignment-menu-button': function () {
        Session.set("assignmentMenu", !Session.get("assignmentMenu"));
        Session.set("upgradeMenu", false);
        Session.set("animalStats", false);
        Session.set("strengthMenu", false);
        Session.set("enhanceMenu", false);
        Session.set("themeMenu", false);
    },
    'click .strength-menu-button': function () {
        Session.set("strengthMenu", !Session.get("strengthMenu"));
        Session.set("upgradeMenu", false);
        Session.set("animalStats", false);
        Session.set("assignmentMenu", false);
        Session.set("enhanceMenu", false);
        Session.set("themeMenu", false);
    },    
    'click .enhance-menu-button': function () {
        Session.set("enhanceMenu", !Session.get("enhanceMenu"));
        Session.set("upgradeMenu", false);
        Session.set("animalStats", false);
        Session.set("assignmentMenu", false);
        Session.set("strengthMenu", false);
        Session.set("themeMenu", false);
    },
    'click .theme-button': function () {
        Session.set("themeMenu", !Session.get("themeMenu"));
    },
  });
  


  //startScreen helpers
  Template.startScreen.helpers({
    
  });
  //startScreen events
  Template.startScreen.events({
    'click .start-button': function () {
      //Start the game
      if (Meteor.userId() == null) {
        throw new Meteor.Error("not-authorized", "user not logged in");
      }
      Meteor.call("start");
      Session.set("started", true);
      if(Session.get("started")){
          //Interval for updating values
        idleInterval = Meteor.setInterval(function () {
          Meteor.call("idleMeterInc");
        }, Session.get("interval") * 1000);
        breedInterval = Meteor.setInterval(function () {
          Meteor.call("innerBreeding", Session.get("autoAssign"));
        }, Session.get("interval") * 20000);//20s * interval = 10s
        crossBreedInterval = Meteor.setInterval(function () {
          Meteor.call("crossBreeding", Session.get("autoAssign"));
        }, Session.get("interval") * 210000);//210s * interval = 105s
        strengthInterval = Meteor.setInterval( function() {
                  Meteor.call("workoutInc");
                }, Session.get("interval") * 100);
      }
    }
  });
}

Meteor.methods({
  
  start: function () {
    
    if(GameState.findOne({ userId: Meteor.userId() }) == null){
        //Current Default Game State
        //Biome:
        //Beach - 0
        //Grasslands - 1 000
        //Swamps - 15 000
        //Mountains - 200 000
        //Forest - 5 000 000
        //Glaciers - 35 000 000
        GameState.insert({
          userId: Meteor.userId(),
          meters: 0,
          selectedTheme: "default",//lowercase
          strength: {
              amt: 1,
              nextTime: 5,
              nextStrengthInc: 1,
              pressed: false,
              currTime: 0,
              endTime: 0,
              strengthWhenDone: 2
          },
          nets: 0,
          meterVel: 0,
          netVel: 0,          
          upgrades: [  
            { animalType: 'Turtle',  amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 25,    speedInc: 1,   biome: 0}
          ]
        });
      }
      //Compares newAnimals to existing, if it contains it, nothing happens, else it adds the new animal w/ default vals
      var user = GameState.findOne({ userId: Meteor.userId() });
      var animals = user.upgrades;
      //This is where the new animals/upgrades will go
      var newAnimals = [
          { animalType: 'Turtle',  amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 25,    speedInc: 1,   biome: 0},
          { animalType: 'Crab',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 50,   speedInc: 2,   biome: 500},
          { animalType: 'Seagull', amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 100,   speedInc: 4,   biome: 1000},
          { animalType: 'Bunny',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 400,  speedInc: 16,  biome: 4000},
          { animalType: 'Fox',     amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 800, speedInc: 32, biome: 8000},
          { animalType: 'Hawk',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 1600, speedInc: 64, biome: 16000},
          { animalType: 'Swamp Frog',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 6400, speedInc: 256, biome: 64000},
          { animalType: 'Salamander',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 12800, speedInc: 512, biome: 128000},
          { animalType: 'Butterfly',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 25600, speedInc: 1024, biome: 256000},
          { animalType: 'Alligator',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 51200, speedInc: 2048, biome: 512000},
          { animalType: 'Mountain Goat',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 204800, speedInc: 8192, biome: 2048000},
          { animalType: 'Mountain Lion',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 409600, speedInc: 16384, biome: 4096000},
          { animalType: 'Eagle',    amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: 819200, speedInc: 32768, biome: 8192000},
      ]
      //
      for(var i = 0; i < newAnimals.length; i++) {
          var found = false;
          for(var j = 0; j < animals.length; j++) {
              if(animals[j].animalType == newAnimals[i].animalType) {
                  found = true;
                  break;
              }
          }
          if(!found){
              animals.push(newAnimals[i]);
          }
      }
      GameState.update({ userId: Meteor.userId() }, 
                  {$set: {upgrades: animals}});
      

  },
  incMeters: function () {
    var tempState = GameState.findOne({ userId: Meteor.userId() });
    GameState.update({ userId: Meteor.userId() }, {$inc: {meters: GameState.findOne({ userId: Meteor.userId() }).strength.amt}});
  },

  incNets: function () {
    var tempState = GameState.findOne({ userId: Meteor.userId() });
    GameState.update({ userId: Meteor.userId() }, {$inc: {nets: 1}});
  },

  incStrength: function () {
    var tempState = GameState.findOne({ userId: Meteor.userId() });
    GameState.update({ userId: Meteor.userId() }, {$inc: {strength: 1}});
  },

  upgrade: function (animal, autoAssign) {
    // var inc = Session.get("autoAssign").inc;
    // var key = Session.get("autoAssign").key;
    // if(animal.amount % 10 != 0 || animal.amount == 0) {
        if(GameState.findOne({ userId: Meteor.userId() }).nets >= animal.netCost){
            // if(autoAssign == "push"){
                GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType }, 
                             {$inc: {"upgrades.$.amount": 1, nets: animal.netCost * -1, 
                                    [autoAssign.value]: animal.speedInc,
                                    [autoAssign.key]: 1} });
            // }
            //  else {
            //     GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType }, 
            //                  {$inc: {"upgrades.$.amount": 1, nets: animal.netCost * -1, 
            //                         netVel: animal.speedInc,
            //                         "upgrades.$.amtCrafting": 1} });
            // }
            GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType }, 
                             {$set: {"upgrades.$.netCost": Math.floor(animal.netCost * 1.25) }});
            //Adds 1 to animal.amount
            //Subtract cost from nets
            //Adds 1 to animal.amtPush
            //Increase meterVel by animal.speedInc
            //Doubles animal.netCost
        }
    //} else {
    //     if(GameState.findOne({ userId: Meteor.userId() }).nets >= animal.netCost){
    //         if(autoAssign == "push"){
    //             GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType }, 
    //                          {$inc: {"upgrades.$.amount": 1, nets: animal.netCost * -1,
    //                                  "upgrades.$.amtPushing": 1} });
    //         } else {
    //             GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType }, 
    //                          {$inc: {"upgrades.$.amount": 1, nets: animal.netCost * -1, 
    //                                 "upgrades.$.amtCrafting": 1} });
    //         }
            
    //         GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType }, 
    //                          {$set: {"upgrades.$.netCost": Math.floor(animal.netCost * 1.25), "upgrades.$.speedInc": animal.speedInc * 2 }});
    //         Meteor.call("velRecheck", GameState.findOne({ userId: Meteor.userId() }).upgrades);
    //         //Adds 1 to animal.amount
    //         //Subtract cost from nets
    //         //Adds 1 to animal.amtPush
    //         //Doubles animal.netCost
    //         //Doubles Animals speedInc
    //         //Reset Meter.vel and craftSpeed for this animal
            
    //     }
    // } 
  },
  //Recalculates Velocity
  //args is list of animals
  velRecheck: function (animals) {
    var meterVelTemp = 0;
    var netVelTemp = 0;
    //Invariant check amtPushing + amtCrafting = amount
    //Calculate meterVel
    //Calculate netVel
    for(var i = 0; i < animals.length; i++){
        if(animals[i].amtCrafting + animals[i].amtPushing + animals[i].mingling != animals[i].amount){
            console.log(animals[i].animalType + "'s amtCrafting + amtPushing + mingling != amount");
        }
        meterVelTemp += animals[i].amtPushing * animals[i].speedInc;
        netVelTemp += animals[i].amtCrafting * animals[i].speedInc;
    }
    GameState.update({ userId: Meteor.userId() },
                     {$set: {meterVel: meterVelTemp, netVel: netVelTemp}});
  },
  //Increments meters and nets by meterVel and netVel every 0.5s
  idleMeterInc: function () {
    GameState.update({ userId: Meteor.userId()},
                     {$inc: { meters: GameState.findOne({ userId: Meteor.userId() }).meterVel / 2,
                              nets: GameState.findOne({ userId: Meteor.userId() }).netVel / 2 }});
    //Check if new animal unlocked
    // if(GameState.findOne({ userId: Meteor.userId() }).nextUnlock.biome < GameState.findOne({ userId: Meteor.userId() }).meters){

    // }
  },
  decPush: function (animal, incrementAmt) {
    if(animal.amtPushing >= incrementAmt) {
      GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType },
            {$inc: { "upgrades.$.amtPushing": -incrementAmt, 
                meterVel: -animal.speedInc * incrementAmt,
                "upgrades.$.mingling": incrementAmt }});
    } else {
      GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType },
            {
              $inc: { 
                meterVel: -animal.speedInc * animal.amtPushing,
                "upgrades.$.mingling": animal.amtPushing },
              $set: { "upgrades.$.amtPushing": 0 }
            });
    }
  },
  incPush: function (animal, incrementAmt) {
    if(animal.mingling >= incrementAmt) {
      GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType },
            {$inc: { "upgrades.$.amtPushing": incrementAmt, 
                meterVel: animal.speedInc * incrementAmt,
                "upgrades.$.mingling": -incrementAmt }});
    } else {
      GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType },
            {
              $inc: { 
                meterVel: animal.speedInc * animal.mingling,
                "upgrades.$.amtPushing": animal.mingling },
              $set: { "upgrades.$.mingling": 0 }
            });
    }

  },
  decCraft: function (animal, incrementAmt) {
    if(animal.amtCrafting >= incrementAmt) {
      GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType },
            {$inc: { "upgrades.$.amtCrafting": -incrementAmt, 
                netVel: -animal.speedInc * incrementAmt,
                "upgrades.$.mingling": incrementAmt }});
    } else {
      GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType },
            {
              $inc: { 
                netVel: -animal.speedInc * animal.amtCrafting,
                "upgrades.$.mingling": animal.amtCrafting },
              $set: { "upgrades.$.amtCrafting": 0 }
            });
    }

  },
  incCraft: function (animal, incrementAmt) {
    if(animal.mingling >= incrementAmt) {
      GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType },
            {$inc: { "upgrades.$.amtCrafting": incrementAmt, 
                netVel: animal.speedInc * incrementAmt,
                "upgrades.$.mingling": -incrementAmt }});
    } else {
      GameState.update({ userId: Meteor.userId(), "upgrades.animalType":animal.animalType },
            {
              $inc: { 
                netVel: animal.speedInc * animal.mingling,
                "upgrades.$.amtCrafting": animal.mingling },
              $set: { "upgrades.$.mingling": 0 }
            });
    }


  },
  

  innerBreeding: function (autoAssign) {
    var tempAnimals = GameState.findOne({ userId: Meteor.userId() }).upgrades;
    var d;
    var prob;
    for(var i = 0; i < tempAnimals.length; i++) {
      if(tempAnimals[i].mingling == 0){
        break;
      }
      d = Math.random();//random number under 1, New number for each pair, so the breeds dont clump up
      prob = tempAnimals[i].mingling / 100;//probability for innerspecies

      if(prob >= 1) {
        GameState.update({ userId: Meteor.userId(), "upgrades.animalType":tempAnimals[i].animalType},
            {$inc: { "upgrades.$.amount": Math.floor(prob),
                [autoAssign.value]: tempAnimals[i].speedInc * Math.floor(prob),
                [autoAssign.key]: Math.floor(prob)}});
        console.log("InnerSpecies Bred: " + tempAnimals[i].animalType + " " + Math.floor(prob) + " times" + " Client");
        prob -= Math.floor(prob);
      }
      if(prob >= d) {
        GameState.update({ userId: Meteor.userId(), "upgrades.animalType":tempAnimals[i].animalType},
            {$inc: { "upgrades.$.amount": 1,
                [autoAssign.value]: tempAnimals[i].speedInc,
                [autoAssign.key]: 1}});
        console.log("InnerSpecies Bred: " + tempAnimals[i].animalType + " Client");
      }

    }
  },
  crossBreeding: function (autoAssign) {
    var tempAnimals = GameState.findOne({ userId: Meteor.userId() }).upgrades;
    var animals = GameState.findOne({ userId: Meteor.userId() }).upgrades;
    var name;
    var breedNum;
    var crossSp;
    var tempName = "";
    var prob;
    var d;
    var found;
    //Speed: (N^2-N)/2 triangle numbers
    for(var i = tempAnimals.length - 1; i >= 0; i--) {
      tempAnimals.pop();
      for(var j = 0; j < tempAnimals.length; j++) {
        //General case, breed value is animal w/ lower amount
        if(animals[i].amount < tempAnimals[j].amount){
          breedNum = animals[i].mingling;
        } else {
          breedNum: tempAnimals[j].mingling;
        }
        name = tempAnimals[j].animalType.concat("_", animals[i].animalType);
        d = Math.random();//random number under 1, New number for each pair, so the breeds dont clump up
        prob = breedNum / 10000;//probability for crossSpecies

        if(prob >= d){
          //IT BREED
          tempName = "";
          crossSp = CrossBreed.findOne()[name];
          if(crossSp == undefined) {
            tempName  = tempName.concat(name.slice(name.search("_") + 1, name.length), "_", 
                name.slice(0, name.search("_")));
            crossSp = CrossBreed.findOne()[tempName];
            console.log("No crossSpecies " + name);
            if(crossSp == undefined) {
                console.log("No crossSpecies " + tempName);
                break;
            }
          }

          // var idx = animals.reduce( function( prev, cur, index ) {
          //     if( cur.animalType == crossSp.animalType && prev === -1 ) {
          //         return index;
          //     }
          //     return prev;

          // }, -1 );

          // var idx = animals.some( function (elem) {
          //   elem.animalType == crossSp.animalType;
          // });

          // if(idx){
          //   GameState.update({ userId: Meteor.userId(), "upgrades.animalType":crossSp.animalType},
          //     {$inc: { "upgrades.$.amount": 1,
          //       [autoAssign.value]: animals[j].speedInc,
          //       [autoAssign.key]: 1}});
          // }


          //If the GameState.Upgrades was a hashmap wouldnt need a loop here.
          //Start from end because most pairs will be closer to there
          for(var k = animals.length - 1; k >= 0; k--) {
              if(animals[k].animalType == crossSp.animalType) {
                  GameState.update({ userId: Meteor.userId(), "upgrades.animalType":crossSp.animalType},
                      {$inc: { "upgrades.$.amount": 1,
                          [autoAssign.value]: animals[k].speedInc,
                          [autoAssign.key]: 1}});
                  found = true;
                  break;
              }
          }
          if(!found) {
              animals.push(crossSp);
              GameState.update({ userId: Meteor.userId() }, 
                  {$set: {upgrades: animals}});  
              GameState.update({ userId: Meteor.userId(), "upgrades.animalType":crossSp.animalType},
                      {$inc: { "upgrades.$.amount": 1,
                          [autoAssign.value]: crossSp.speedInc,
                          [autoAssign.key]: 1}});
          }
          console.log("Crossspecies Bred: " + crossSp.animalType + " Client as");  


        }
      }
    }
  },
  //Increments currTime
  workoutInc: function() {
    var strength = GameState.findOne({ userId: Meteor.userId() }).strength;
    if(strength.pressed){
      if(strength.currTime >= strength.endTime) {
        GameState.update({ userId: Meteor.userId()},
                        {$set: { "strength.amt": strength.strengthWhenDone,
                            "strength.pressed": false,
                            "strength.currTime": 0}});
      } else {
        GameState.update({ userId: Meteor.userId() }, {$inc: { "strength.currTime": 0.1}});  
      }
      

    }
  },
  //Set currTime, endTime, nextTime, nextStrengthInc, pressed, strengthWhenDone
  //times are all halved
  workout: function() {
    var strength = GameState.findOne({ userId: Meteor.userId() }).strength;
    if(!strength.pressed) {
      GameState.update({ userId: Meteor.userId()},
                      {$set: { "strength.currTime": 0 ,
                          "strength.endTime":  strength.nextTime,
                          "strength.nextTime": Math.floor(strength.nextTime * 1.25 + 60),
                          "strength.nextStrengthInc": Math.floor(strength.nextStrengthInc * 4),
                          "strength.pressed": true, 
                          "strength.strengthWhenDone": strength.amt + strength.nextStrengthInc }});
      
    }
  },
  selectTheme: function(biome) {  
      GameState.update({ userId: Meteor.userId() }, 
                {$set: {selectedTheme: biome}});
  }

});



if (Meteor.isServer) {
  Meteor.publish("gameStates", function(){
    return GameState.find({userId: this.userId});
  });
  //Reset Animal List on start up
  CrossBreed.remove({});
  // CrossBreed.insert(animalCollection);
  if (CrossBreed.find({}).count() === 0) {
    var crossBreedMap = {};
    crossBreedMap["Turtle_Crab"] = { animalType: 'Turlte Crab',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 5000,  biome: 100};
    crossBreedMap["Turtle_Seagull"] = { animalType: 'Shelled Seagull',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 15000,  biome: 300};
    crossBreedMap["Turtle_Bunny"] = { animalType: 'Shelled Bunny',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 20000,  biome: 1000};
    crossBreedMap["Turtle_Fox"] = { animalType: 'Armored Fox',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 30000,  biome: 1000};
    crossBreedMap["Turtle_Hawk"] = { animalType: 'Armored Fox',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 30000,  biome: 1000};
    crossBreedMap["Turtle_Swamp Frog"] = { animalType: 'Shelled Frog',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 200000,  biome: 15000};
    crossBreedMap["Turtle_Salamander"] = { animalType: 'Tank Salamander',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 400000,  biome: 50000};
    crossBreedMap["Turtle_Butterfly"] = { animalType: 'Armored Butterfly',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 800000,  biome: 100000};
    crossBreedMap["Turtle_Alligator"] = { animalType: 'Turtlligator',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 160000,  biome: 175000};
    crossBreedMap["Turtle_Mountain Goat"] = { animalType: 'Mountain Goatle',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 320000,  biome: 200000};
    crossBreedMap["Turtle_Mountain Lion"] = { animalType: 'Mountain Turtlion',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 640000,  biome: 1000000};
    crossBreedMap["Crab_Seagull"] = { animalType: 'Crabgull',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 1000,  biome: 500};
    crossBreedMap["Crab_Fox"] = { animalType: 'Crab Fox',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 30000,  biome: 7500};
    crossBreedMap["Crab_Hawk"] = { animalType: 'Crab Hawk',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 75000,  biome: 10000};
    crossBreedMap["Crab_Frog"] = { animalType: 'Crab Frog',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 175000,  biome: 15000};
    crossBreedMap["Crab_Butterfly"] = { animalType: 'Buttercrab Flyer',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 250000,  biome: 100000};
    crossBreedMap["Crab_Alligator"] = { animalType: 'Crabbigator',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 300000,  biome: 175000};
    crossBreedMap["Crab_Mountain Lion"] = { animalType: 'Mountain Crablion',   amount: 0, amtPushing: 0, amtCrafting: 0, mingling: 0, netCost: NaN,  speedInc: 700000,  biome: 1000000};
    CrossBreed.insert(crossBreedMap);
  }
  Meteor.publish("crossBreeds", function(){
    return CrossBreed.find();
  });
}
