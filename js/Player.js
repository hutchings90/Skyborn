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

Player.prototype.load = function(data) {
	// console.log('load');
	this.name = data.name;
	this.loadMapState(data.mapState);
	this.loadStats(data.health, data.energy, data.attack, data.defense, data.speed);
	this.status = data.status;
	this.loadPack(data.pack);
};

Player.prototype.loadMapState = function(mapState) {
	this.mapState.mapI = mapState.mapI;
	this.mapState.x = mapState.x;
	this.mapState.y = mapState.y;
	this.mapState.direction = mapState.direction;
	this.mapState.movement = null;
};

Player.prototype.loadStats = function(health, energy, attack, defense, speed) {
	this.health = new Health(health.cur, health.max, health.boosts);
	this.energy = new Energy(energy.cur, energy.max, energy.boosts);
	this.attack = new Attack(attack.cur, attack.max, attack.boosts);
	this.defense = new Defense(defense.cur, defense.max, defense.boosts);
	this.speed = new Speed(hspeed.cur, hespeed.max, heaspeed.boosts);
};

Player.prototype.canSwim = function() {
	// console.log('canSwim');
	return false;
};