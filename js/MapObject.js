function MapObject(x, y, spaces) {
	// console.log('MapObject');
	this.x = x;
	this.y = y;
	this.spaces = spaces || [];
	this.className = 'MapObject';
}

MapObject.prototype.load = function(data) {
	console.log('load');
	var l = data.spaces.length;
	this.x = data.x;
	this.y = data.y;
	this.spaces.length = l;
	for (var i = 0; i < l; i++) {}
};

function GenericPersonObject(x, y, key, texts, onanswer, onend) {
	// console.log('GenericPersonObject');
	MapObject.call(this, x, y, [
		[ new CollidingSpace(key, true, false, null, function(skyborn) {
			var dx = x - skyborn.player.mapState.x;
			var dy = y - skyborn.player.mapState.y;
			var e = document.getElementById('map').children[y].children[x];
			var direction = null;
			if (dx > 0) direction = 'left';
			else if (dx < 0) direction = 'right';
			else if (dy > 0) direction = 'up';
			else if (dy < 0) direction = 'down';
			e.replaceChild(skyborn.cm.getSprite(key, direction), e.children[1]);
			skyborn.mapDialogInputHandler.showMapDialog(this.interactDialog);
		}, null, null, null, new Dialog(texts, onanswer, onend)) ]
	]);
	this.className = 'GenericPersonObject';
}

GenericPersonObject.prototype = Object.create(MapObject.prototype);
GenericPersonObject.constructor = GenericPersonObject;

function HouseObject(x, y, doorX, signX, onopen, signTexts) {
	// console.log('HouseObject');
	MapObject.call(this, x, y, [
		[ new CollidingSpace('houseRoofLeft'), new CollidingSpace('houseRoof', false, true), new CollidingSpace('houseRoof', false, true), new CollidingSpace('houseRoof', false, true), new CollidingSpace('houseRoofRight') ],
		[ new CollidingSpace('houseExteriorWallLeft'), new CollidingSpace('houseExteriorWall', false, true), , new CollidingSpace('houseExteriorWall', false, true), new CollidingSpace('houseExteriorWallRight') ]
	]);
	this.className = 'HouseObject';
	if (doorX >= 0) this.spaces[1][doorX] = new CollidingSpace('door1', false, true, null, null, onopen);
	if (signX >= 0) {
		this.spaces[1][signX] = new CollidingSpace('houseExteriorWallSign', false, true, null, function(skyborn) {
			skyborn.mapDialogInputHandler.showMapDialog(new Dialog(signTexts));
		});
	}
}

HouseObject.prototype = Object.create(MapObject.prototype);
HouseObject.constructor = HouseObject;

function Flower1Object(x, y) {
	// console.log('Flower1Object');
	MapObject.call(this, x, y, [
		[ new CollidingSpace('flower1', false, true) ]
	]);
	this.className = 'Flower1Object';
}

Flower1Object.prototype = Object.create(MapObject.prototype);
Flower1Object.constructor = Flower1Object;

function FenceObject(x, y, l, gateX, key, side, orientation, hideTerrain) {
	// console.log('FenceObject');
	MapObject.call(this, x, y, [[]]);
	this[orientation](l, key, side, gateX, hideTerrain);
	this.className = 'FenceObject';
}

FenceObject.prototype = Object.create(MapObject.prototype);
FenceObject.constructor = FenceObject;

FenceObject.prototype.horizontal = function(l, key, side, gateX, hideTerrain) {
	// console.log('horizontal');
	this.spaces[0].length = l;
	for (var i = 0; i < l; i++) this.spaces[0][i] = this.partial(key, side, hideTerrain);
	if (gateX >= 0) this.spaces[0][gateX] = this.gate(key);
};

FenceObject.prototype.vertical = function(l, key, side, gateX, hideTerrain) {
	// console.log('vertical');
	this.spaces.length = l;
	for (var i = 0; i < l; i++) this.spaces[i] = [ this.partial(key, side, hideTerrain) ];
	if (gateX >= 0) this.spaces[gateX] = [ this.gate(key) ];
};

FenceObject.prototype.partial = function(key, side, hideTerrain) {
	// console.log('partial');
	return new CollidingSpace(key + side, false, hideTerrain);
};

FenceObject.prototype.gate = function(key) {
	// console.log('gate');
	return new CollidingSpace(key + 'GateClosed', false);
};

function Stairs1(x, y, l, side, orientation) {
	// console.log('Stairs1');
	MapObject.call(this, x, y);
	this[orientation](l, side);
	this.className = 'Stairs1';
}

Stairs1.prototype = Object.create(MapObject.prototype);
Stairs1.constructor = Stairs1;

Stairs1.prototype.horizontal = function(l, side) {
	this.spaces = [[], []];
	this.spaces[0].l = l;
	this.spaces[1].l = l;
	for (var i = 0; i < l; i++) {
		this.spaces[0][i] = this.middle(side);
		this.spaces[1][i] = this.middle(side);
	}
}

Stairs1.prototype.vertical = function(l, side) {
	this.spaces = [];
	this.spaces.length = l;
	for (var i = 0; i < l; i++) {
		this.spaces[i].length = 2;
		this.spaces[i][0] = this.middle(side);
		this.spaces[i][1] = this.middle(side);
	}
}

Stairs1.prototype.partial = function(side, hideTerrain) {
	// console.log('partial');
	return new Space('stairs1' + side, false, hideTerrain);
};

Stairs1.prototype.middle = function(side) {
	// console.log('partial');
	return this.partial('Middle' + side);
};

function TreeRow(x, y, l, orientation, i) {
	// console.log('TreeRow');
	MapObject.call(this, x, y);
	this[orientation](l, i);
	this.className = 'TreeRow';
}

TreeRow.prototype = Object.create(MapObject.prototype);
TreeRow.constructor = TreeRow;

TreeRow.prototype.horizontal = function(l, i='') {
	// console.log('horizontal');
	var key = 'tree' + i;
	this.spaces = [[]];
	this.spaces[0].length = l;
	for (var i = 0; i < l; i++) this.spaces[0][i] = this.partial(key);
};

TreeRow.prototype.vertical = function(l, i='') {
	// console.log('vertical');
	var key = 'tree' + i;
	this.spaces = [];
	this.spaces.length = l;
	for (var i = 0; i < l; i++) {
		var row = [];
		row.length = 1;
		row[0] = this.partial(key);
		this.spaces[i] = row;
	}
};

TreeRow.prototype.partial = function(key) {
	// console.log('partial');
	return new CollidingSpace(key, false, true);
};

function WaterRow(x, y, l, orientation, i) {
	// console.log('WaterRow');
	MapObject.call(this, x, y);
	this[orientation](l, i);
	this.className = 'WaterRow';
}

WaterRow.prototype = Object.create(MapObject.prototype);
WaterRow.constructor = WaterRow;

WaterRow.prototype.horizontal = function(l) {
	// console.log('horizontal');
	var key = 'water';
	this.spaces = [[]];
	this.spaces[0].length = l;
	for (var i = 0; i < l; i++) this.spaces[0][i] = this.partial(key);
};

WaterRow.prototype.vertical = function(l) {
	// console.log('vertical');
	var key = 'water';
	this.spaces = [];
	this.spaces.length = l;
	for (var i = 0; i < l; i++) {
		var row = [];
		row.length = 1;
		row[0] = this.partial(key);
		this.spaces[i] = row;
	}
};

WaterRow.prototype.partial = function(key) {
	// console.log('partial');
	return new Space(key, false, true, function() {}, null, function(skyborn) {
		if (!skyborn.player.canSwim()) return true;
	});
};

function RockRow(x, y, l, orientation, i) {
	// console.log('RockRow');
	MapObject.call(this, x, y);
	this[orientation](l, i);
	this.className = 'RockRow';
}

RockRow.prototype = Object.create(MapObject.prototype);
RockRow.constructor = RockRow;

RockRow.prototype.horizontal = function(l, i='') {
	// console.log('horizontal');
	var key = 'rock' + i;
	this.spaces = [[]];
	this.spaces[0].length = l;
	for (var i = 0; i < l; i++) this.spaces[0][i] = this.partial(key);
};

RockRow.prototype.vertical = function(l, i='') {
	// console.log('vertical');
	var key = 'rock' + i;
	this.spaces = [];
	this.spaces.length = l;
	for (var i = 0; i < l; i++) {
		var row = [];
		row.length = 1;
		row[0] = this.partial(key);
		this.spaces[i] = row;
	}
};

RockRow.prototype.partial = function(key) {
	// console.log('partial');
	return new CollidingSpace(key);
};