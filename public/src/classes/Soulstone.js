
Soulstone = function(game, x, y, frame, color) {

  Phaser.Sprite.call(this, game, x, y, 'interface-soul-stones', frame);
  this.color = color;
  this.index = frame;
  this.alpha = 0.5;

  this.events.onInputUp.add(this.upClick, this);
}

// Contstruct Soulstone prototype as Phaser sprite
Soulstone.prototype = Object.create(Phaser.Sprite.prototype);
Soulstone.prototype.constructor = Soulstone;

Soulstone.prototype.upClick = function() {
  gameState.invokeMana(players[playerTurn], this.index);
  Client.playerInvokedMana(this.index)
};

Soulstone.prototype.disable = function() {
  this.alpha = 0.5;
  this.inputEnabled = false;
  this.input.useHandCursor = false;
};
Soulstone.prototype.enable = function() {
  this.alpha = 1;
  this.inputEnabled = true;
  this.input.useHandCursor = true;
};
