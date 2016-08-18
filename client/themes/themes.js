Template.themes.helpers({
    biomes: function () {
        var biomes = ["Beach"]
        var y = 0;
        var x = function(biome) {
            var bdom = Blaze._globalHelpers.biomeDomain(biome);
            var nextBiome;
            if(GameState.findOne({ userId: Meteor.userId() }).meters < bdom) {
                return biomes;
            } else {
                nextBiome = Blaze._globalHelpers.biome(bdom).toLowerCase();
                biomes.push(Blaze._globalHelpers.biome(bdom));
                x(nextBiome);
            }
        }
        if(y == 0 ) {
            y = 1;
            x("beach");
        } 
        return biomes;
        
        

    },
    biomesTest: function () {
        return ["beach", "forest", "lake"];
    },
    
    

});

Template.themes.events({
    'click .theme-choice': function () {
        
        Meteor.call("selectTheme", this.toLowerCase());
    }
});