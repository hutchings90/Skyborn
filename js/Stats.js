function Health(cur, max, boosts) {
	// console.log('Health');
	Stat.call(this, 'Health', cur, max, boosts);
}

Health.prototype = Object.create(Stat.prototype);
Health.prototype.constructor = Health;

function Energy(cur, max, boosts) {
	// console.log('Energy');
	Stat.call(this, 'Energy', cur, max, boosts);
}

Energy.prototype = Object.create(Stat.prototype);
Energy.prototype.constructor = Energy;

function Attack(cur, max, boosts) {
	// console.log('Attack');
	Stat.call(this, 'Attack', cur, max, boosts);
}

Attack.prototype = Object.create(Stat.prototype);
Attack.prototype.constructor = Attack;

function Defense(cur, max, boosts) {
	// console.log('Defense');
	Stat.call(this, 'Defense', cur, max, boosts);
}

Defense.prototype = Object.create(Stat.prototype);
Defense.prototype.constructor = Defense;

function Speed(cur, max, boosts) {
	// console.log('Speed');
	Stat.call(this, 'Speed', cur, max, boosts);
}

Speed.prototype = Object.create(Stat.prototype);
Speed.prototype.constructor = Speed;