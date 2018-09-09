function MapInputHandler(skyborn) {
	// console.log('MapInputHandler');
	InputHandler.call(this, skyborn);
}

MapInputHandler.prototype = Object.create(InputHandler.prototype);
MapInputHandler.prototype.constructor = MapInputHandler;

MapInputHandler.prototype.onkeydown = function(ev) {
	this.keysDown[ev.keyCode] = true;
	switch (ev.keyCode) {
	case ESCAPE_KEY: this.skyborn.showGameMapMenu(); break; // Enter
	case ENTER_KEY: this.skyborn.showPlayerMapMenu(); break; // Enter
	case SPACE_KEY: this.skyborn.am.interact(this.skyborn); break; // Spacebar
	case A_KEY:
	case LEFT_KEY: this.skyborn.am.movePlayer(this, 'left'); break; // Left Arrow
	case W_KEY:
	case UP_KEY: this.skyborn.am.movePlayer(this, 'up'); break; // Up Arrow
	case D_KEY:
	case RIGHT_KEY: this.skyborn.am.movePlayer(this, 'right'); break; // Right Arrow
	case S_KEY:
	case DOWN_KEY: this.skyborn.am.movePlayer(this, 'down'); break; // Down Arrow
	default: return;
	}
	ev.preventDefault();
};

MapInputHandler.prototype.stillMoving = function(direction) {
	// console.log('stillMoving');
	switch (direction) {
	case 'left': return this.keysDown[LEFT_KEY] || this.keysDown[A_KEY];
	case 'up': return this.keysDown[UP_KEY] || this.keysDown[W_KEY];
	case 'right': return this.keysDown[RIGHT_KEY] || this.keysDown[D_KEY];
	case 'down': return this.keysDown[DOWN_KEY] || this.keysDown[S_KEY];
	}
	return false;
};

MapInputHandler.prototype.getOtherDirection = function(direction) {
	// console.log('getDirection');
	if ((this.keysDown[LEFT_KEY] || this.keysDown[A_KEY]) && direction != 'left') return 'left';
	if ((this.keysDown[UP_KEY] || this.keysDown[W_KEY]) && direction != 'up') return 'up';
	if ((this.keysDown[RIGHT_KEY] || this.keysDown[D_KEY]) && direction != 'right') return 'right';
	if ((this.keysDown[DOWN_KEY] || this.keysDown[S_KEY]) && direction != 'down') return 'down';
	return null;
};

MapInputHandler.prototype.pivot = function() {
	// console.log('pivot');
	return this.keysDown[SHIFT_KEY];
};