// Custom game object

Arrow = function(game, x, y, arrowImage, angle, name) {
  Phaser.Sprite.call(this, game, x, y, arrowImage, 0);
  this.name = name;
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
  this.scale.x = 1;
  this.scale.y = 1;
}
Arrow.prototype.rollOver = function(){
  console.log(this)
  this.scale.x = 1.4;
  this.scale.y = 1.4;
}
// Handle the direction arrow being clicked on
Arrow.prototype.upClick = function() {
  this.setFrames = 1;
};
