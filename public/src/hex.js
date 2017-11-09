/*
TODO:
Create interface and disablement manager
Create non-traversable edged tiles
Create tile spritesheet
*/

// Construct a new phaser game
var game = new Phaser.Game(800, 680, Phaser.AUTO, 'Container', null, true),
Main = function() {};
var Player = {};

Main.prototype = {
  preload: function() {
    game.load.image('loading', 'assets/images/loading.png');
    game.load.image('loading-bg', 'assets/images/loading-bg.png');
    game.load.image('logo', 'assets/images/logo.png');
    game.load.script('splash', 'src/states/Splash.js');
  },
  create: function() {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }
};

game.state.add('Main', Main);
game.state.start('Main');
