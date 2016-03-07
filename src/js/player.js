var Player = function(game, x, y) {
  this.game = game;
  Phaser.Sprite.call(this, game, x, y, 'tri'); 

    // this.player = this.game.add.sprite(Game.w/2, Game.h/2, 'tri');
  this.anchor.setTo(0.5);
  this.passengers = 0;
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.drag.set(0.5);
  this.body.maxVelocity.setTo(800, 800);
  this.body.collideWorldBounds = true;
  this.scale.x = 1.2;
  this.scale.y = 1.2;
  this.fireRate = 250;
  this.nextFire = 0;
  this.health = 10;

  this.game.camera.follow(this, Phaser.Camera.FOLLOW_TOPDOWN);

  this.game.add.existing(this);


  this.bullets = this.game.add.group();
  this.bullets.enableBody = true;
  this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
  this.bullets.createMultiple(30, 'pbullet', 0, false);
  this.bullets.setAll('anchor.x', 0);
  this.bullets.setAll('anchor.y', 0.5);
  this.bullets.setAll('outOfBoundsKill', true);
  this.bullets.setAll('checkWorldBounds', true);
  // this.shoot_s = this.game.add.sound('shot');
  // this.shoot_s.volume = 0.2;

    //Accept Arrow Keys as input
  this.cursors = game.input.keyboard.createCursorKeys();
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

  //capture
  this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN
  ]);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.update = function() {
    // Controls
    if (this.cursors.left.isDown || aKey.isDown)
        this.angle -= 4.5;
    else if (this.cursors.right.isDown || dKey.isDown)
        this.angle += 4.5;

    if (this.cursors.up.isDown || wKey.isDown)
        this.currentSpeed = 550;
        // this.currentSpeed = 150;
    else if (this.cursors.down.isDown || sKey.isDown)
      this.currentSpeed = 0; //Drift
    else
        if (this.currentSpeed > 0)
            this.currentSpeed -= 12;

    if (this.currentSpeed > 0)
        this.game.physics.arcade.velocityFromRotation(this.rotation, this.currentSpeed, this.body.velocity);

    if (this.game.input.activePointer.isDown && this.alive == true)
    {
      console.log(this.bullets);
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
          // this.shoot_s.play();
          this.nextFire = this.game.time.now + this.fireRate;
          var bullet = this.bullets.getFirstExists(false);
          bullet.reset(this.x, this.y); bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 2000);
        }
    }
};
Player.prototype.damage = function() {
  this.health -= 1;
  if (this.health <= 0) {
    this.alive = false;
    this.kill();
  }
};
Player.prototype.constructor = Player;
