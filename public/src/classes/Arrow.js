// Custom game object

Arrow = function(game, x, y, arrowImage, angle, direction) {
  // this instance, game, x, y, image key
  Phaser.Sprite.call(this, game, x, y, arrowImage);
  this.name = 'arrow'+direction;
  this.direction = direction;
  this.angle += angle;
  this.anchor.setTo(0.5, 0.5);
  this.visible = false;
  arrowsArray.push(this);

  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.events.onInputOut.add(this.rollOut, this);
  this.events.onInputOver.add(this.rollOver, this);
  this.events.onInputUp.add(this.upClick, this);
  directionalArrows.add(this);
}

// Construct arrow
Arrow.prototype = Object.create(Phaser.Sprite.prototype);
Arrow.prototype.constructor = Arrow;

Arrow.prototype.rollOut = function(){
  this.frame = 0;
  this.scale.x = 1;
  this.scale.y = 1;
}
Arrow.prototype.rollOver = function(){
  this.frame = 1;
  this.scale.x = 1.5;
  this.scale.y = 1.5;
}
// Handle the direction arrow being clicked on
// Note for futer debugging that localhost caches the images. visit the image
// url to update
Arrow.prototype.upClick = function() {
  // Hide the arrows
  directionalArrows.visible = false;
  // Send socket event
  Client.playerChangedDirection(players[playerTurn], this.direction);
  // Change the player directionr
  Game.prototype.changeDirection(players[playerTurn], this.direction);
};
