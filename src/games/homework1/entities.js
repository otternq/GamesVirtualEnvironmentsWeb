var Character = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);

        // set the walking speed
        this.setVelocity(2.5, 2.5);

        this.setFriction(0.2, 0.2);

        // adjust the bounding box
        this.updateColRect(20,24, 44, 16);

        // disable gravity
        this.gravity = 0;
        
        //allow for combat
        this.inCombat = false;
        this.inCombatWith = null;

        this.firstUpdates = 2;
        this.direction = 'down';
        this.destinationX = x;
        this.destinationY = y;

        this.addAnimation("stand-down", [0]);
        this.addAnimation("stand-left", [7]);
        this.addAnimation("stand-up", [14]);
        this.addAnimation("stand-right", [21]);
        this.addAnimation("down", [1,2,3,4,5,6]);
        this.addAnimation("left", [8,9,10,11,12,13]);
        this.addAnimation("up", [15,16,17,18,19,20]);
        this.addAnimation("right", [22,23,24,25,26,27]);
        
        this.name = "";
        this.health = 100;
    },

    update: function() {
    
        if (this.health < 0) {
            toastr.info("NOOOO!!!!", this.name);
			me.game.remove(this);
            return false;
        }
    
        hadSpeed = this.vel.y !== 0 || this.vel.x !== 0;

        this.handleInput();

        // check & update player movement
        updated = this.updateMovement();
        
        me.game.HUD.setItemValue("health", this.health);
        
        // check for collision with other objects
        res = me.game.collide(this);
        
        // check if we collide with an enemy :
        if (res && (res.obj.type == me.game.ENEMY_OBJECT))
        {
            
            
          if (res.x != 0) {
             // x axis
             if (res.x<0) {
                //console.log("x axis : left side !");
             } else {
                //console.log("x axis : right side !");
             }
          } else {
             // y axis
             if (res.y<0) {
                //console.log("y axis : top side !");
             } else {
                //console.log("y axis : bottom side !");
             }
          }
          
          if (this.inCombat == false && res.obj.type == me.game.ENEMY_OBJECT) {//entering combat
          
              this.inCombat = true;
              //console.log("The collision object is:" + res.obj);
              this.inCombatWith = res.obj;
                
              toastr.warning("You have entered combat", "Combat", {timeOut: 50});
          }
          
          
        } else {//not in collision
        
            if (this.inCombat == true) { //leave combat
                toastr.info("You have exited combat", "Combat", {timeOut: 50});
                this.inCombat = false;
                this.inCombatWith = null;
            }
            
        }
        

        if (this.vel.y === 0 && this.vel.x === 0)
        {
            this.setCurrentAnimation('stand-' + this.direction)
            if (hadSpeed) {
                updated = true;
            }
        }

        // update animation
        if (updated)
        {
            // update object animation
            this.parent(this);
        }
        return updated;
    },

    handleInput: function() {
        if (this.destinationX < this.pos.x - 10)
        {
            this.vel.x -= this.accel.x * me.timer.tick;
            this.setCurrentAnimation('left');
            this.direction = 'left';
        }
        else if (this.destinationX > this.pos.x + 10)
        {
            this.vel.x += this.accel.x * me.timer.tick;
            this.setCurrentAnimation('right');
            this.direction = 'right';
        }

        if (this.destinationY < this.pos.y - 10)
        {
            this.vel.y = -this.accel.y * me.timer.tick;
            this.setCurrentAnimation('up');
            this.direction = 'up';
        }
        else if (this.destinationY > this.pos.y + 10)
        {
            this.vel.y = this.accel.y * me.timer.tick;
            this.setCurrentAnimation('down');
            this.direction = 'down';
        }
    },
    
    attack: function() {
        var attack = this.weapons[this.weapon].attack();
        console.log("Dealing " + attack + " damage");
        
        if (attack == 0) {
            console.log("Attach missed");
            toastr.warning("Attack missed!", this.name,  {timeOut:2000});
        } else {

            this.inCombatWith.health -= attack;
            console.log("Delt " + attack + " damage");
            toastr.info("Attack Fit! " + attack + " damage. Enemy now at "+ this.inCombatWith.health + " health", this.name,  {timeOut:2000});
        }
        
        console.log("Calling enemy attack");
        this.inCombatWith.attack();
        console.log("Out of enemy attack");
    }
});

/* --------------------------
an enemy Entity
------------------------ */
var EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.spritewidth = 64;
 
        // call the parent constructor
        this.parent(x, y, settings);
        
        this.gravity = 1;
        
        this.health = 100;
        
        console.log("settings.width="+settings.width);
        settings.width = 100;
 
        this.startX = x;
        //this.endX = x + settings.width - settings.spritewidth;
        this.endX = 90;
        // size of sprite
 
        // make him start from the right
        //console.log("settings.width: "+ settings.width);
        //console.log("settings.spritewidth: " + settings.spritewidth);
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;
 
        // walking & jumping speed
        this.setVelocity(1, 6);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
        
        this.name="Bad Guys";
        
        this.weapon = 0;
        
        this.weapons = [
            new Fist(),
            new Knife(),
            new Sword()
        ]
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
        
        
        if (this.inCombatWith != obj) {
            this.inCombatWith = obj;
            console.log(this.name + ": " + obj.name + " is in contact with me. Attack!!");
        }
        
        //this.attack();
        
        
    },
 
    // manage the enemy movement
    update: function() {
            
        if (this.health < 0) {
            toastr.info(this.name + " Died");
            // remove it
            toastr.info("NOOOO!!!!", this.name);
			me.game.remove(this);
            return false;
        }
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            /*
            console.log("walkLeft is set to: "+ this.walkLeft);
            
            // make it walk
            this.flipX(this.walkLeft);*/
            
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
            
        
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
        
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    },
    
    attack: function() {
    
        console.log(this.name + ": in attack function");
    
        var attack = this.weapons[this.weapon].attack();
        
        if (attack == 0) {
            //toastr.warning("Attack missed!", this.name,  {timeOut:2000});
            console.log(this.name + " Attack Missed!");
        } else {

            this.inCombatWith.health -= attack;
            console.log(this.name + ": Delt " + attack + " damage");
            toastr.warning("Attack Fit! " + attack + " damage", this.name,  {timeOut:2000});
        }
    }
});


var PlayerEntity = Character.extend({

    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        //localPlayerCreated(this);
        
        this.name = "Player 1";
        
        this.weapon = 0;
        
        this.weapons = [
            new Fist(),
            new Knife(),
            new Sword()
        ]
        
    },

    handleInput: function() {
        if (me.input.isKeyPressed('left'))
        {
            this.vel.x -= this.accel.x * me.timer.tick;
            this.setCurrentAnimation('left');
            this.direction = 'left';
            
        }
        else if (me.input.isKeyPressed('right'))
        {
            this.vel.x += this.accel.x * me.timer.tick;
            this.setCurrentAnimation('right');
            this.direction = 'right';
        }

        if (me.input.isKeyPressed('up'))
        {
            this.vel.y = -this.accel.y * me.timer.tick;
            this.setCurrentAnimation('up');
            this.direction = 'up';
        }
        else if (me.input.isKeyPressed('down'))
        {
            this.vel.y = this.accel.y * me.timer.tick;
            this.setCurrentAnimation('down');
            this.direction = 'down';
        }
        
        
        if (me.input.isKeyPressed('shift'))
        {
            if (this.inCombat == true) {
                console.log("Attacking");
                
                this.attack();
            }
        }
        
        if(me.input.isKeyPressed('Z'))
        {
            this.weapon += 1;
            if (this.weapon >= this.weapons.length) {
                this.weapon = 0;
            }
            
            console.log("Pressing z");
            me.game.HUD.setItemValue("weapon", this.weapons[this.weapon].name);
        }
    }

});