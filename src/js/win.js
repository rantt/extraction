/*global Game*/
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Game.Win = function(game){
  this.game = game;
};

Game.Win.prototype =  {
    create: function() {

		this.game.stage.backgroundColor = '#000';

    for (var i = 0;i < 1000;i++) {
      var bright = ['#FFF','#dcdcdc','#efefef','#ffff00','#00ff00'];
      var sizes = [1,1,1,1,1,2,2,2,3,3,3,4,4,5,6,7,8]
      var starSize = sizes[rand(0,16)];

      this.game.add.sprite(rand(0,COLS*4*TILE_SIZE),rand(0,ROWS*4*TILE_SIZE),this.makeBox(starSize, starSize, bright[rand(0,2)]));
    }



      //Setup WASD and extra keys
      this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.cursors = this.game.input.keyboard.createCursorKeys();

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(Game.w/2, Game.h/2+100,'twitter', this.twitter, this);
    this.twitterButton.fixedToCamera = true;
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;


      this.playAgainText = this.game.add.bitmapText(Game.w + 200, Game.h/2, 'minecraftia','You WIN!\nPlay Again?',48);
      
      this.playAgainText.anchor.set(0.5);
      this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() { 
          this.game.add.tween(this.playAgainText).to({x: Game.w/2}, 355, Phaser.Easing.Linear.None).start();
          this.twitterButton.visible = true;
      }, this);

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown || this.wKey.isDown || this.cursors.up.isDown){
        this.game.state.start('Play');
      }
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
      var game_url = 'http://www.divideby5.com/games/extraction/'; 
      var twitter_name = 'rantt_';
      var tags = [''];

      window.open('http://twitter.com/share?text=I+escaped+the+invasing+playing+Extraction+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
    },

};
