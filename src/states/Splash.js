var Splash = function () {};

Splash.prototype = {
  loadScripts: function () {
    // Classes
    game.load.script('tile',  'src/classes/Tile.js');
    game.load.script('splash',  'src/classes/Arrow.js');
    // States
    game.load.script('menu','src/states/Menu.js');
    game.load.script('game','src/states/Game.js');
    game.load.script('gameOver','src/states/GameOver.js');
  },

  loadSounds: function () {
  },

  loadImages: function () {
    game.load.image('tile', 'assets/images/tile.png');
    game.load.image('tile-grass', 'assets/images/tile-grass.png');
    game.load.image('tile-stone', 'assets/images/tile-stone.png');
    game.load.image('interface-mouseover-tile', 'assets/images/interface-mouseover-tile.png');
    game.load.spritesheet('interface-direction-arrow', 'assets/images/interface-direction-arrow.png', 16, 16);
    game.load.spritesheet('player', 'assets/images/player.png', 32, 32);
  },

  loadFonts: function () {
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.status = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
  },

  // The preload function then will call all of the previously defined functions:
  preload: function () {
    // Add everthing for the loading screen
    game.add.sprite(0, 0, 'splash-bg');
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    // Start loading
    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadSounds();
  },

  addGameStates: function () {
    game.state.add("Menu", Menu);
    game.state.add("Game", Game);
    game.state.add("GameOver", GameOver);
    // game.state.add("Credits", Credits);
    // game.state.add("Options", Options);
  },

  addGameMusic: function () {
    // music = game.add.audio('dangerous');
    // music.loop = true;
    // music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    // this.addGameMusic();

    setTimeout(function () {
      game.state.start("Menu");
    }, 1000);
  }

}
