var TILE_SIZE = 64,
ROWS = 12,
COLS = 12;

var Game = {
  w: TILE_SIZE * COLS,
  h: TILE_SIZE * ROWS 
};

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
    // console.log('blah'+Game.w);
		this.game.stage.backgroundColor = '#000';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
		this.game.load.image('instructions', 'assets/images/instructions.png');
    this.game.load.bitmapFont('minecraftia', 'assets/fonts/font.png', 'assets/fonts/font.xml'); //load default font

    //Scale Image to Fit Window
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.maxHeight = window.innerHeight;
    this.game.scale.maxWidth = window.innerHeight*(Game.w/Game.h);

  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  preload: function() {
    
    //Debug Plugin
    // this.game.add.plugin(Phaser.Plugin.Debug);

    //Loading Screen Message/bar
    var loadingText = this.game.add.bitmapText(Game.w/2, Game.h/2, 'minecraftia', 'Loading...', 30).anchor.setTo(0.5);
  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);

    //Load button for twitter
    this.game.load.image('twitter','assets/images/twitter.png');

    this.game.load.image('background','assets/images/background.png');

    this.game.load.spritesheet('tiles', 'assets/images/tiles.png', 20, 20, 7);

    this.game.load.image('ship', 'assets/images/ship.png');
    this.game.load.image('enemy', 'assets/images/enemy.png');
    this.game.load.image('ebullet', 'assets/images/bullet.png');
    this.game.load.image('pbullet', 'assets/images/pbullet.png');

    this.game.load.audio('hit', 'assets/audio/hit.wav');
    this.game.load.audio('hit_shield', 'assets/audio/hit_shield.wav');
    this.game.load.audio('explosion', 'assets/audio/explosion.wav');
    this.game.load.audio('laser', 'assets/audio/laser.wav');
    this.game.load.audio('elaser', 'assets/audio/elaser.wav');
    
    // Music Track
    this.game.load.audio('music','assets/audio/put_yourself_in_my_place.mp3');

  },
  create: function() {
    this.game.state.start('Menu');
    // this.game.state.start('Play');
  }
};
