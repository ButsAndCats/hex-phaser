var Splash = function () {};

Splash.prototype = {
  loadScripts: function () {
    // Plugins
    game.load.script('phaser-input', 'lib/phaser-input.min.js')
    game.load.script('phaser-nineslice', 'lib/phaser-nineslice.js')
    game.load.script('phaser-scollable', 'lib/phaser-scrollable.min.js')
    // Classes
    game.load.script('tile',  'src/classes/Tile.js');
    game.load.script('splash',  'src/classes/Arrow.js');
    // States
    game.load.script('login','src/states/Login.js');
    game.load.script('register','src/states/Register.js');
    game.load.script('lobby','src/states/Lobby.js');
    game.load.script('menu','src/states/Menu.js');
    game.load.script('game','src/states/Game.js');
    game.load.script('gameOver','src/states/GameOver.js');
  },

  loadSounds: function () {
    game.load.audio('crystal-cave', 'assets/audio/song18.mp3');
  },

  loadImages: function () {
    // Game state
    game.load.image('tile', 'assets/images/tile.png');
    game.load.image('tile-grass', 'assets/images/tile-grass.png');
    game.load.image('tile-stone', 'assets/images/tile-stone.png');
    game.load.image('interface-mouseover-tile', 'assets/images/interface-mouseover-tile.png');
    game.load.image('interface-mouseover-tile', 'assets/images/interface-mouseover-tile.png');
    game.load.spritesheet('interface-direction-arrow', 'assets/images/interface-direction-arrow.png', 16, 16);
    game.load.spritesheet('player', 'assets/images/player.png', 32, 32);

    // Lobby state
    game.load.image('chat-input', 'assets/images/chat-input.png');
    game.load.image('chat-output', 'assets/images/chat-output.png');
    game.load.image('chat-container', 'assets/images/chat-container.png');
    game.load.spritesheet('send-btn', 'assets/images/send-btn-sheet.png', 95, 40);
    game.load.spritesheet('play-btn', 'assets/images/play-btn-sheet.png', 123, 141);

    // Login state
    game.load.spritesheet('register-btn', 'assets/images/register-btn.png', 173, 46);
    game.load.spritesheet('login-btn', 'assets/images/login-btn.png', 173, 46);

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
    game.state.add("Login", Login);
    game.state.add("Register", Register);
    game.state.add("Lobby", Lobby);
    game.state.add("Menu", Menu);
    game.state.add("Game", Game);
    game.state.add("GameOver", GameOver);
    // game.state.add("Credits", Credits);
    // game.state.add("Options", Options);
  },

  addGameMusic: function () {
    music = game.add.audio('crystal-cave');
    music.loop = true;
    // music.play();
  },

  initializePlugins: function() {
    game.add.plugin(PhaserInput.Plugin);
    game.plugins.add(PhaserNineSlice.Plugin);
  },

  create: function() {
    this.initializePlugins();
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("Login");
    }, 1000);
  }

}
