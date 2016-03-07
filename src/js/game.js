/*global Game*/

var game = new Phaser.Game(Game.w, Game.h, Phaser.AUTO, 'game');


game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Play', Game.Play);
game.state.add('Win', Game.Win);
game.state.add('Lose', Game.Lose);

game.state.start('Boot');
