var Splash = function () {};

Splash.prototype = {
  loadScripts: function () {
    game.load.script('tile',  'src/classes/tile.js');
    game.load.script('splash',  'src/classes/arrow.js');
  },

  loadBgm: function () {
  },

  loadImages: function () {
    game.load.image('tile', 'assets/tile.png');
    game.load.image('tile-grass', 'assets/tile-grass.png');
    game.load.image('tile-stone', 'assets/tile-stone.png');
    game.load.image('player1-cursor', 'assets/player1-cursor.png');
    game.load.image('interface-mouseover-tile', 'assets/interface-mouseover-tile.png');
    game.load.spritesheet('interface-direction-arrow', 'assets/interface-direction-arrow.png', 16, 16);
    game.load.spritesheet('player', 'assets/player.png', 32, 32);
  },

  loadFonts: function () {
  },

  // The preload function then will call all of the previously defined functions:
  preload: function () {
    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

    var loadingBar, status;
    // Add the background
    game.add.sprite(0, 0, 'splash-bg');
    loadingBar = game.add.sprite(game.world.centerX, 400, "loading");
    status = game.add.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    this.load.setPreloadSprite(loadingBar);
  },
}
