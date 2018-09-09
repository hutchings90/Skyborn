const MAX_PACK_SIZE = 30;
const SUCCESSFUL_ADD = 0;
const PACK_FULL = 1;
const ITEM_FULL = 2;
const PACK_ERROR_REPORTS = [null, 'Pack is full.', 'Can\'t carry any more of that item.'];

function Pack(items) {
	// console.log('Pack');
	this.items = items || {};
}

Pack.prototype.addItem = function(item) {
	// console.log('addItem');
	if (item.count) {
		var packItem = this.items[item.name];
		if (packItem) {
			if (packItem.add(item.count)) return ITEM_FULL;
			return SUCCESSFUL_ADD;
		}
	}
	else if (this.items.length >= MAX_PACK_SIZE) return PACK_FULL;
	this.items[item.name] = item;
	return SUCCESSFUL_ADD;
};

Pack.prototype.removeItem = function(key) {
	// console.log('removeItem');
	delete this.items[key];
};

Pack.prototype.hasItem = function(item) {
	// console.log('hasItem');
	return this.items[item.name] != null;
};