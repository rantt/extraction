/*global Game*/

Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {
    //Generate Level with Cellular Automata
   
    for (var i = 0;i < 1000;i++) {
      var bright = ['#FFF','#dcdcdc','#efefef','#ffff00','#00ff00'];
      var sizes = [1,1,1,1,1,2,2,2,3,3,3,4,4,5,6,7,8]
      var starSize = sizes[rand(0,16)];

      this.game.add.sprite(rand(0,COLS*4*TILE_SIZE),rand(0,ROWS*4*TILE_SIZE),this.makeBox(starSize, starSize, bright[rand(0,2)]));
    }


    this.titleText = this.game.add.bitmapText(Game.w/2, Game.h/2-100, 'minecraftia', "EXTRACTION", 42 );
    this.titleText.anchor.setTo(0.5);
    this.titleText.tint = 0xff0000;

    this.game.add.tween(this.titleText)
      .to( {y:100 }, 2000, Phaser.Easing.Linear.In, true, 0, -1)
      .yoyo(true);


    var instructions = this.game.add.bitmapText(Game.w/2, Game.h-200, 'minecraftia', 'Fly to each planet and extracts its survivors to win.\nControls:\nWASD/Arrows to steer\nClick to Shoot', 18);
    instructions.anchor.setTo(0.5);

    var music_by = this.game.add.bitmapText(Game.w/2, Game.h-10, 'minecraftia', 'Music: Cannon Tube by Max Gooroo', 18);
    music_by.anchor.setTo(0.5);
    music_by.inputEnabled = true;
    music_by.events.onInputDown.add(function() {
      window.open("http://opengameart.org/content/cannon-tube");
    },this);
    music_by.events.onInputOver.add(function() {
      music_by.tint = 0xffff00;
    },this);
    music_by.events.onInputOut.add(function() {
      music_by.tint = 0xffffff;
    },this);




        // Start Message

        var clickText = this.game.add.bitmapText(Game.w/2, Game.h/2+50, 'minecraftia', '~click to start~', 24).anchor.setTo(0.5); 

    },
		makeBox: function(x,y,color) {
			var bmd = this.game.add.bitmapData(x, y);
			bmd.ctx.beginPath();
			bmd.ctx.rect(0, 0, x, y);
			bmd.ctx.fillStyle = color;
			bmd.ctx.fill();
			return bmd;
		},

    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }
    }
};


