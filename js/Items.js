const HERB_HEAL_AMOUNT = 15;

function Herb(count) {
	// console.log('Herb');
	if (count === null) count = 1;
	DuplicatableItem.call(this, 'Herb', count);
}

Herb.prototype = Object.create(DuplicatableItem.prototype);
Herb.prototype.constructor = Herb;

Herb.prototype.use = function(skyborn) {
	// console.log('use');
	if (!this.wouldAffect(skyborn)) return 'It would have no effect.';
	this.count--;
	return 'Replenished ' + skyborn.player.health.replenish(HERB_HEAL_AMOUNT) + ' HP';
};

Herb.prototype.wouldAffect = function(skyborn) {
	// console.log('wouldAffect');
	return skyborn.player.health.cur <= skyborn.player.health.max;
};

function RingOfAndoris() {
	// console.log('RingOfAndoris');
	Item.call(this, 'Ring of Andoris', 'The king\'s ring');
}

RingOfAndoris.prototype = Object.create(Item.prototype);
RingOfAndoris.constructor = RingOfAndoris;