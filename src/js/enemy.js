var Enemy = function(index,game, player, bullets) {
  this.game = game;
  this.name = index;
  this.player = player;


  var x = this.game.world.randomX;
  var y = this.game.world.randomY; 

  Phaser.Sprite.call(this, game, x, y, 'enemy'); 
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.anchor.setTo(0.5);
  this.health = 3;
  this.bullets = bullets;
  this.fireRate = 500;
  this.nextFire = 0;
  this.alive = true;
  this.angle = this.game.rnd.angle();
  this.body.immovable = false;
  this.body.collideWorldBounds = true;
  this.body.bounce.setTo(1, 1);
  this.scale.x = 0.9;
  this.scale.y = 0.9;

  this.hitSnd = this.game.add.sound('hit');
  this.hitSnd.volume = 0.2;
  this.explosionSnd = this.game.add.sound('explosion');
  this.explosionSnd.volume = 0.2;
  this.shootSnd = this.game.add.sound('elaser');
  this.shootSnd.volume = 0.2;

  this.game.add.existing(this);

    // 50% Chance to spawn heading toward Tri
    // if (rand(0,1) === 1) {
      this.game.physics.arcade.velocityFromRotation(this.rotation, 100, this.body.velocity);
    // }else {
    //   this.game.physics.arcade.velocityFromRotation(game.physics.arcade.angleBetween(this, this.player), 150, this.body.velocity);
    // }
    var particle = this.game.add.bitmapData(4, 4);
    particle.ctx.beginPath();
    particle.ctx.rect(0, 0, x, y);
    particle.ctx.fillStyle = '#ffff00';
    particle.ctx.fill();


    this.emitter = game.add.emitter(0, 0, 200);
    // this.emitter.makeParticles('pixel');
    this.emitter.makeParticles(particle);
    this.emitter.gravity = 0;
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(200, 200);


};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.update = function() {
  this.rotation = this.game.physics.arcade.angleBetween(this, this.player);
  if (this.game.physics.arcade.distanceBetween(this, this.player) < 300 && this.alive ) {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      if (this.player.alive === true) {
        this.shootSnd.play();
        this.nextFire = this.game.time.now + this.fireRate;
        
        var bullet = this.bullets.getFirstDead();
        bullet.reset(this.x, this.y);
        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
      }
    }
  }
};
Enemy.prototype.damage = function() {
  this.hitSnd.play();
  this.health -= 1;
  if (this.health <= 0) {
    this.emitter.x = this.x;
    this.emitter.y = this.y;
    this.emitter.start(true, 1000, null, 128);

    this.explosionSnd.play();
    this.alive = false;
    this.kill();
  }
};
Enemy.prototype.constructor = Enemy;
