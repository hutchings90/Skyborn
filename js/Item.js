const DUPLICATION_LIMIT = 30;

function Item(name, description) {
	// console.log('Item');
	this.name = name;
	this.description = description;
}

Item.prototype.use = function(skyborn) {
	// console.log('default use');
};

Item.prototype.drop = function() {
	// console.log('default drop');
	return true;
};

Item.prototype.wouldAffect = function() {
	// console.log('wouldAffect');
	return false;
};

function DuplicatableItem(name, count) {
	// console.log('DuplicatableItem');
	Item.call(this, name);
	this.count = count;
}

DuplicatableItem.prototype = Object.create(Item.prototype);
DuplicatableItem.prototype.constructor = DuplicatableItem;

DuplicatableItem.prototype.add = function(count) {
	// console.log('add');
	var leftover = this.count + count - DUPLICATION_LIMIT;
	if (leftover > 0) return leftover;
	this.count += count;
};

DuplicatableItem.prototype.drop = function(count) {
	// console.log('drop');
	this.count -= count;
	return count < 1;
};