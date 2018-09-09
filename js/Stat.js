function Stat(name, cur, max, boosts) {
	// console.log('Stat');
	this.name = name || 'Stat';
	this.cur = cur || 0;
	this.max = max || cur || 0;
	this.boosts = boosts || [];
}

Stat.prototype.increase = function(amount) {
	// console.log('increase');
	this.max += amount;
	this.replenish(amount);
	return amount;
};

Stat.prototype.replenish = function(amount) {
	// console.log('replenish');
	var overflow = this.cur + amount - this.max;
	if (overflow > 0) return this.replenish(amount - overflow);
	this.cur += amount;
	return amount;
};

Stat.prototype.reduce = function(amount) {
	// console.log('reduce');
	this.cur -= amount;
	if (this.cur < 0) {
		amount += this.cur;
		this.cur = 0;
	}
	return amount;
};

Stat.prototype.boost = function(amount, duration) {
	// console.log('boost');
	this.boosts.push({ amount: amount, duration: duration });
};

Stat.prototype.useBoosts = function() {
	// console.log('useBoosts');
	for (var i = this.boosts.length - 1; i >= 0; i--)
		if (--this.boosts[i].duration == 0) this.boosts.splice(i, 1);
};

Stat.prototype.getCur = function() {
	// console.log('getCur');
	var amount = this.cur;
	for (var i = this.boosts.length - 1; i >= 0; i--) amount += this.boosts[i].amount;
	return amount;
};