function Player(name, mapI, x, y, direction) {
	// console.log('Player');
	this.name = name || 'Skylar';
	this.pack = new Pack();
	this.mapState = {
		mapI: mapI,
		x: x,
		y: y,
		movement: null,
		direction: direction
	};
	this.health = new Health(30, 1000);
	this.energy = new Energy(30);
	this.attack = new Attack(30);
	this.defense = new Defense(30);
	this.speed = new Speed(30);
	this.status = 'Normal';
}

Player.prototype.mapMove = function(direction) {
	// console.log('mapMove');
	switch (direction) {
	case 'left': this.mapState.x -= 1; break;
	case 'up': this.mapState.y -= 1; break;
	case 'right': this.mapState.x += 1; break;
	case 'down': this.mapState.y += 1; break;
	}
};

Player.prototype.canSwim = function() {
	// console.log('canSwim');
	return false;
};