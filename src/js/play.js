/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var wKey;
var aKey;
var sKey;
var dKey;
var score = 0;
// var FLOOR,WALL;
var enemies = [];
var enemyBullets;
var enemiesTotal = 20;
var enemiesAlive = 0;
var enemiesMax = 10;


Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  init: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create: function() {

    this.sizeMult = 4;

    this.game.world.setBounds(0, 0 ,Game.w*this.sizeMult,Game.h*this.sizeMult);

    for (var i = 0;i < 1000;i++) {
      var bright = ['#FFF','#dcdcdc','#efefef','#ffff00','#00ff00'];
      var sizes = [1,1,1,1,1,2,2,2,3,3,3,4,4,5,6,7,8]
      var starSize = sizes[rand(0,16)];

      this.game.add.sprite(rand(0,COLS*this.sizeMult*TILE_SIZE),rand(0,ROWS*this.sizeMult*TILE_SIZE),this.makeBox(starSize, starSize, bright[rand(0,2)]));
    }

    var colors = Phaser.Color.HSVColorWheel();
    //Passenger Pickup 
    this.transferDelay = this.game.time.now;
    this.transferInc = 0;

    //Build Planets
    this.planets = this.game.add.group();
    var pcount = 6;
    this.pickupCount = 0;
    for (var i = 0; i < pcount;i++) {
      var x = rand(0,COLS*this.sizeMult*TILE_SIZE);  
      var y = rand(0,ROWS*this.sizeMult*TILE_SIZE);  
      var color = colors[rand(0,300)].rgba;
      var planet =  this.game.add.sprite(x, y, this.makeCircle(rand(128,256), color));
      planet.color = color;
      planet.passengers = rand(5,12);
      planet.total = planet.passengers;
      this.pickupCount += planet.total;
      this.planets.add(planet); 
    }

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Load Minimap Background
    this.miniPixel = 4;
    var miniMapBmd = this.game.add.bitmapData(COLS*this.sizeMult*this.miniPixel, ROWS*this.sizeMult*this.miniPixel);

    miniMapBmd.rect(0, 0, COLS*this.sizeMult*this.miniPixel, ROWS*this.sizeMult*this.miniPixel, '#213D5E');

    //Add Planets to Minimap
    this.planets.forEach(function(planet) {
      miniMapBmd.rect(planet.x*this.miniPixel/TILE_SIZE, planet.y*this.miniPixel/TILE_SIZE, this.miniPixel, this.miniPixel, planet.color);
    },this);


    this.map = this.game.add.sprite(0, 0, miniMapBmd);
    this.map.fixedToCamera = true;

    this.miniMapOverlay = this.game.add.bitmapData(COLS*this.sizeMult*this.miniPixel, ROWS*this.sizeMult*this.miniPixel);
    this.mapOverlay = this.game.add.sprite(0, 0, this.miniMapOverlay);
    this.mapOverlay.fixedToCamera = true;

    this.player = new Player(this.game, Game.w/2, Game.h/2); 

    //Enemies
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'ebullet');

    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new Enemy(i, this.game, this.player, enemyBullets));
    }

    // this.pickupBar = this.game.add.sprite(this.player.x, this.player.y-32, this.makeBox(80,7,'#00ff00'));
    this.pickupBar = this.game.add.sprite(this.player.x, this.player.y-32, this.makeBox(80,7,'#ffff00'));
    this.pickupBar.anchor.setTo(0.5);
    this.pickupBar.visible = false;

    this.healthBar = this.game.add.sprite(this.player.x, this.player.y-52, this.makeBox(80,7,'#00ff00'));
    this.healthBar.anchor.setTo(0.5);
    // this.healthBar.fixedToCamera = true;

    this.passengerText = this.game.add.bitmapText(Game.w-320, 20,'minecraftia', 'Passengers: ' + this.player.passengers + '/'  + this.pickupCount, 24); 
    this.passengerText.fixedToCamera = true;
   
    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(Game.w/2, Game.h/2, 'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },
  update: function() {
    
    if (this.player.alive) {
      //Passenger Pickup Text
      this.passengerText.setText('Passengers: ' + this.player.passengers + '/'  + this.pickupCount, 24); 

      //update map markers
      this.miniMapOverlay.context.clearRect(0, 0, this.miniMapOverlay.width, this.miniMapOverlay.height)
      this.miniMapOverlay.rect(Math.floor(this.player.x*this.miniPixel/TILE_SIZE), Math.floor(this.player.y*this.miniPixel/TILE_SIZE), this.miniPixel, this.miniPixel, '#ff0000');

      this.planets.forEach(function(planet) {
        if (planet.passengers <= 0) {
          this.miniMapOverlay.rect(Math.floor(planet.x*this.miniPixel/TILE_SIZE), Math.floor(planet.y*this.miniPixel/TILE_SIZE), this.miniPixel+1, this.miniPixel+1, '#fff');
        }
        this.miniMapOverlay.rect(Math.floor(this.player.x*this.miniPixel/TILE_SIZE), Math.floor(this.player.y*this.miniPixel/TILE_SIZE), this.miniPixel, this.miniPixel, '#ff0000');
        if (this.game.physics.arcade.distanceBetween(this.player, planet) < 300) {
           //transfer passengers to ship
           if (planet.passengers > 0) {
             if (this.transferDelay < this.game.time.now) {
               this.transferInc += 1;
               this.player.passengers += 1;
               planet.passengers -= 1;
               this.transferDelay = this.game.time.now + 500;
             }
             this.pickupBar.visible = true;
             this.pickupBar.x = this.player.x;
             this.pickupBar.y = this.player.y-32;
             this.pickupBar.scale.x = this.transferInc/planet.total; 
           }else {
               this.pickupBar.visible = false;
               this.transferInc = 0;
           }
        }
      },this);

      this.miniMapOverlay.dirty = true;

      //Check if Enemy is hit
      for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].alive) {
          enemiesAlive++;
          this.game.physics.arcade.overlap(this.player.bullets, enemies[i], this.bulletHitEnemy, null, this);
        }
      }
     
     //Check if Enemy Bullet hits Player 
    this.game.physics.arcade.overlap(enemyBullets, this.player, this.bulletHitPlayer, null, this);
      
     this.healthBar.x = this.player.x;
     this.healthBar.y = this.player.y-52;


    }else if (this.player.passengers == this.pickupCount) {
			this.game.stat.start('Win');
    }else {
			this.game.stat.start('Lose');
    }

      // // Toggle Music
      // muteKey.onDown.add(this.toggleMute, this);

  },
  bulletHitPlayer: function(player, bullet) {
    bullet.kill();
    this.player.damage();
    this.healthBar.scale.x = this.player.health/10;
  },
  bulletHitEnemy: function(enemy, bullet) {
    bullet.kill();
    enemies[enemy.name].damage();
  },
  makeTiles: function(tile_size) {
    var bmd = game.make.bitmapData(tile_size * 25, tile_size * 2);

    var colors = Phaser.Color.HSVColorWheel();

    var i = 0;

    for (var y = 0; y < 2; y++)
    {
        for (var x = 0; x < 25; x++)
        {
            bmd.rect(x * tile_size, y * tile_size, tile_size, tile_size, colors[i].rgba);
            i += 6;
        }
    }
		return bmd;
  },
	makeCircle: function(circSize, color) {
		var bmd = this.game.add.bitmapData(circSize, circSize);
		bmd.circle(circSize/2,circSize/2,circSize/2, color);
		return bmd;
	},
  makeBox: function(x,y,color) {
		var bmd = this.game.add.bitmapData(x, y);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, x, y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fill();
		return bmd;
	},

  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
    var twitter_name = 'rantt_';
    var tags = [''];

    window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};
