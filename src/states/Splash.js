var Splash = function () {};

Splash.prototype = {
  loadScripts: function () {
    // Classes
    game.load.script('tile',  'src/classes/Tile.js');
    game.load.script('splash',  'src/classes/Arrow.js');
    // States
    game.load.script('lobby','src/states/Lobby.js');
    game.load.script('menu','src/states/Menu.js');
    game.load.script('game','src/states/Game.js');
    game.load.script('gameOver','src/states/GameOver.js');
  },

  loadSounds: function () {
    game.load.audio('crystal-cave', 'assets/audio/song18.mp3');
  },

  loadImages: function () {
    game.load.image('tile', 'assets/images/tile.png');
    game.load.image('tile-grass', 'assets/images/tile-grass.png');
    game.load.image('tile-stone', 'assets/images/tile-stone.png');
    game.load.image('interface-mouseover-tile', 'assets/images/interface-mouseover-tile.png');
    game.load.image('chat-input', 'assets/images/chat-input.png');
    game.load.image('send-btn-down', 'assets/images/send-btn-down.png');
    game.load.image('send-btn-up', 'assets/images/send-btn-up.png');
    game.load.image('interface-mouseover-tile', 'assets/images/interface-mouseover-tile.png');
    game.load.spritesheet('interface-direction-arrow', 'assets/images/interface-direction-arrow.png', 16, 16);
    game.load.spritesheet('player', 'assets/images/player.png', 32, 32);
  },

  loadFonts: function () {
  },

  init: function () {
    this.logo = game.make.sprite(game.world.centerX, 190, 'logo');
    this.loadingBg = game.make.sprite(game.world.centerX, 300, 'loading-bg');
    this.loadingBar = game.make.sprite(game.world.centerX, 300, 'loading');
  },

  // The preload function then will call all of the previously defined functions:
  preload: function () {
    // Add everthing for the loading screen
    game.add.existing(this.loadingBg).anchor.setTo(0.5,0.5);
    game.add.existing(this.loadingBar).anchor.setTo(0.5,0.5);
    game.add.existing(this.logo).anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // Start loading
    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadSounds();
  },

  addGameStates: function () {
    game.state.add("Menu", Menu);
    game.state.add("Lobby", Lobby);
    game.state.add("Game", Game);
    game.state.add("GameOver", GameOver);
    // game.state.add("Credits", Credits);
    // game.state.add("Options", Options);
  },

  addGameMusic: function () {
    music = game.add.audio('crystal-cave');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.addGameStates();
    this.addGameMusic();
    console.log('ready')
    setTimeout(function () {
      game.state.start("Lobby");
    }, 1000);
  }

}
