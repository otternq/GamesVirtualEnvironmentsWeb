/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [
    {
        name: "area01_level_tiles",
        type: "image",
        src: "data/area01_tileset/area01_level_tiles.png"
    },
    {
        name: "wheelie_right",
        type: "image",
        src: "data/sprite/wheelie_right.png"
    },
    {
        name: "area01",
        type: "tmx",
        src: "data/area01.tmx"
    },
    {
        name: "metatiles32x32",
        type: "image",
        src: "data/area02_tileset/metatiles32x32.png"
    
    },
    {
        name: "fog",
        type: "image",
        src: "data/area02_tileset/fog.png"
    
    },
    {
        name: "player_male_base",
        type: "image",
        src: "data/area02_tileset/player_male_base.png"
    
    },
    {
        name: "pset",
        type: "image",
        src: "data/area02_tileset/pset.png"
    },
    {
        name: "desert1",
        type: "image",
        src: "data/area02_tileset/desert1.png"
    },
    {
        name: "area02",
        type: "tmx",
        src: "data/map.tmx"
    },
    {
        name: "gripe_run_right",
        type: "image",
        src: "data/sprite/gripe_run_right.png"
    },
    // game font
    {
        name: "32x32_font",
        type: "image",
        src: "data/sprite/32x32_font.png"
    }
];


var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										
    */
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
       me.state.set(me.state.PLAY, new PlayScreen());

       // add our player entity in the entity pool
        me.entityPool.add("mainPlayer", PlayerEntity);
        me.entityPool.add("secondPlayer", EnemyEntity);
                 
       // enable the keyboard
       me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.SHIFT, "shift");
          
       // start the game 
       me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
      // stuff to reset on state change
      
      //load a level
      me.levelDirector.loadLevel("area02");
      
      // add a default HUD to the game mngr
      me.game.addHUD(0, 430, 640, 60);
 
      // add a new HUD item
      me.game.HUD.addItem("score", new ScoreObject(620, 10));
	},
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
	
   }

});

/*-------------- 
a score HUD Item
--------------------- */
 
var ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        // call the parent constructor
        this.parent(x, y);
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
    },
 
    /* -----
 
    draw our score
 
    ------ */
    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }
 
});


//bootstrap :)
window.onReady(function() 
{
    toastr.warning('My name is Inigo Montoya. You Killed my father, prepare to die!');
    toastr.clear();
	jsApp.onload();
});
