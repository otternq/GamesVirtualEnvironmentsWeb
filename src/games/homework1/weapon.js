var Weapon = Object.extend({
    init: function() {
        this.name = "";
        this.damage = 0;
        this.odds = 0;
    },
    
    attack: function() {
        
        if ( Math.random() < this.odds ) {
            return this.damage;
        }
        
        return 0;
    }//END function attack
});

var Fist = Weapon.extend({
    init: function() {
        this.name = "Fist";
        this.damage = 5;
        this.odds = 0.25;
    }
});

var Knife = Weapon.extend({
    init: function() {
        this.name = "Knife";
        this.damage = 15;
        this.odds = 0.25;
    }
});

var Sword = Weapon.extend({
    init: function() {
        this.name = "Sword";
        this.damage = 55;
        this.odds = 0.45;
    }
});