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
    },

    update: function() {
        hadSpeed = this.vel.y !== 0 || this.vel.x !== 0;

        this.handleInput();

        // check & update player movement
        updated = this.updateMovement();
        
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
        
        this.gravity = 0;
        
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
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (res.y > 0) && obj.falling) {
            this.flicker(45);
        }
    },
 
    // manage the enemy movement
    update: function() {
        
        // do nothing if not visible
        if (this.visible == false || this.alive == false) {
            return false;
        }
            
        if (this.health < 0) {
            this.alive = false;
            this.visible = false;
            toastr.info("Enemy Died");
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
    }
});


var PlayerEntity = Character.extend({

    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        //localPlayerCreated(this);
        
        this.weapon = new Knife();
        
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
                
                var attack = this.weapon.attack();
                me.game.HUD.updateItemValue("score", attack);
                
                this.inCombatWith.health -= attack;
                
                console.log("Attacking");
            }
        }
    }

});