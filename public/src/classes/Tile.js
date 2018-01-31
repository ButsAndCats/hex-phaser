//  Here is a custom game object that represents a hexagonal tile
                //scope, location, sprite frame, style, coords, tilemp index
Tile = function (game, x, y, tileFrame, isVertical, i, j, k, type) {

  Phaser.Sprite.call(this, game, x, y, 'tile-sheet', tileFrame);

  this.anchor.setTo(0.5, 0.5);

  this.verticalOffset = 24;

  if(i === players[1].location.i && j === players[1].location.j) {
    console.log(players[1]);
    players[1].location.x = x;
    players[1].location.y = -(this.verticalOffset/2);
    players[1].location.k = k;
  }
  if(i === players[2].location.i && j === players[2].location.j) {
    console.log(players[2]);
    players[2].location.x = x;
    players[2].location.y = -(this.verticalOffset/2);
    players[2].location.k = k;
  }


  this.name = 'tile'+i+'_'+j+'_'+k;
  this.type = type;
  this.i = i;
  this.j = j;
  this.k = k;
  this.marked = false;

  this.inputEnabled = true;
  this.input.useHandCursor = true;
  // this.events.onInputOut.add(this.rollOut, this);
  this.events.onInputOver.add(this.rollOver, this);
  this.events.onInputUp.add(this.upClick, this);

};

// Contstruct Tile as Phaser sprite
Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

// display border frame sprite on mouse over
Tile.prototype.rollOver = function() {
  tileMouseOver.x = this.x;
  tileMouseOver.y = this.y-(tileVOffset/2);
  tileMouseOver.visible = true;
};

Tile.prototype.upClick = function() {
  var player = players[playerTurn];
  if(this.marked) {
    gameState.unHighlightMoves();
    Client.playerMovedLocation([this.i, this.j, this.k]);
    gameState.moveToCoordinates(player, [this.i, this.j, this.k]);
  } else {
    console.log(this)
  }
};
