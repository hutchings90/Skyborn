const MAP_HEIGHT = 11;
const MAP_WIDTH = 11;

function Map(defaultTerrain, mapObjects, onleave) {
	// console.log('Map');
	this.height = MAP_HEIGHT;
	this.width = MAP_WIDTH;
	this.defaultTerrain = defaultTerrain;
	this.mapObjects = mapObjects || [];
	this.spaces = [];
	this.spaces.length = this.height;
	this.onleave = onleave || function(skyborn, direction) {
		// console.log('default onleave');
	};
	this.refreshSpaces();
}

Map.prototype.load = function(data) {
	// console.log('load');
	this.height = data.height;
	this.width = data.width;
	this.defaultTerrain = data.defaultTerrain;
	this.mapObjects = [];
	for (var i = 0; i < data.mapObjects.length; i++) {
		var m = new window[data.mapObjects[i].className]();
		m.load(data.mapObjects[i]);
		data.mapObjects[i] = m;
	}
	this.spaces = [];
	this.spaces.length = this.height;
	this.refreshSpaces();
};

Map.prototype.refreshSpaces = function() {
	// console.log('refreshSpaces');
	for (var i = 0; i < this.height; i++) {
		var row = [];
		row.length = this.width;
		for (var j = 0; j < this.width; j++) row[j] = new Space();
		this.spaces[i] = row;
	}
	for (var i = 0, mOsL = this.mapObjects.length; i < mOsL; i++) {
		var mO = this.mapObjects[i];
		var mX = mO.x;
		var mY = mO.y;
		for (var j = 0, mOL = mO.spaces.length; j < mOL; j++) {
			var row = mO.spaces[j];
			var sY = mY + j;
			for (var k = 0, rowL = row.length; k < rowL; k++) {
				var s = row[k];
				var sX = mX + k;
				if (s) this.spaces[sY][sX] = s;
			}
		}
	}
};

Map.prototype.draw = function(skyborn) {
	// console.log('draw');
	var g = skyborn.es['map-container'];
	var cm = skyborn.cm;
	var player = skyborn.player;
	var mapE = document.createElement('div');
	mapE.id = 'map';
	for (var i = 0, sL = this.spaces.length; i < sL; i++) {
		var row = this.spaces[i];
		var rowE = document.createElement('div');
		for (var j = 0, rL = row.length; j < rL; j++) rowE.appendChild(this.drawSpace(cm, row[j]));
		mapE.appendChild(rowE);
	}
	this.positionPlayer(mapE, cm, player, player.mapState.direction || 'down');
	g.appendChild(mapE);
	setTimeout(function() {
		mapE.className = 'entering';
	}, 0);
	var onend = function(ev) {
		skyborn.mapInputHandler.activate();
		skyborn.utils.unsetTransitionListeners(mapE, onend);
	};
	skyborn.utils.setTransitionListeners(mapE, onend);
};

Map.prototype.drawSpace = function(cm, s) {
	var e = document.createElement('div');
	e.className = 'space';
	if (!s.hideTerrain) {
		var backgroundE = cm.getImage(this.defaultTerrain);
		backgroundE.className = 'background';
		e.appendChild(backgroundE);
	}
	if (s.key) {
		var se = null;
		if (s.isSprite) se = cm.getSprite(s.key, 'down');
		else se = cm.getImage(s.key);
		e.appendChild(se);
	}
	return e;
};

Map.prototype.erase = function(skyborn, onend) {
	// console.log('erase');
	if (!onend) onend = EMPTY_FUNC;
	skyborn.mapInputHandler.deactivate();
	var e = document.getElementById('map');
	e.className = 'leaving';
	var func = function() {
		skyborn.utils.unsetTransitionListeners(e, func)
		e.parentNode.removeChild(e);
		onend();
	};
	skyborn.utils.setTransitionListeners(e, func);
};

Map.prototype.goToMap = function(skyborn, i) {
	// console.log('goToMap');
	var e = document.getElementById('map');
	if (!e) {
		skyborn.am = skyborn.maps[i];
		skyborn.am.draw(skyborn);
		return;
	}
	var me = this;
	var onend = function(ev) {
		skyborn.am = skyborn.maps[i];
		skyborn.am.draw(skyborn);
		skyborn.utils.unsetTransitionListeners(e, onend);
	};
	me.erase(skyborn, onend);
};

Map.prototype.positionPlayer = function(mapE, cm, player, direction) {
	// console.log('positionPlayer');
	var playerE = cm.getSprite('player', direction);
	playerE.id = 'player';
	this.removePlayerE();
	mapE.children[player.mapState.y].children[player.mapState.x].appendChild(playerE);
};

Map.prototype.movePlayer = function(ih, direction) {
	// console.log('movePlayer');
	var skyborn = ih.skyborn;
	var player = skyborn.player;
	if (player.mapState.movement) return;
	var cm = skyborn.cm;
	var playerE = document.getElementById('player');
	player.mapState.direction = direction;
	if (ih.pivot()) {
		playerE.parentElement.replaceChild(cm.getSprite('player', direction), playerE);
		return;
	}
	var nextS = this.getSpace(player.mapState, player.mapState.direction);
	if (!nextS) {
		playerE.parentElement.replaceChild(cm.getSprite('player', direction), playerE);
		this.onleave(skyborn);
		return;
	}
	if (nextS.oncollide(skyborn) || this.getSpace(player.mapState).onleave(skyborn)) {
		playerE.parentElement.replaceChild(cm.getSprite('player', direction), playerE);
		return;
	}
	playerE.parentElement.replaceChild(cm.getSprite('player', direction + 'Walk'), playerE);
	player.mapState.movement = direction;
	this.beginPlayerMovement(ih, document.getElementById('map'), cm, player, direction, playerE);
};

Map.prototype.beginPlayerMovement = function(ih, mapE, cm, player, direction) {
	// console.log('beginPlayerMovement');
	var me = this;
	var skyborn = ih.skyborn;
	var d = 0;
	var playerE = document.getElementById('player');
	var interval = setInterval(function() {
		d += 5;
		switch (direction) {
		case 'left': playerE.style.left = '-' + d + 'px'; break;
		case 'up': playerE.style.top = '-' + d + 'px'; break;
		case 'right': playerE.style.left = d + 'px'; break;
		case 'down': playerE.style.top = d + 'px'; break;
		}
		if (d > 59) {
			d = 0;
			player.mapMove(direction);
			me.positionPlayer(mapE, cm, player, direction);
			var mapState = skyborn.player.mapState;
			if (me.spaces[mapState.y][mapState.x].onenter(skyborn)) stop = true;
			else {
				var stop = false;
				var nextS = null;
				if (!ih.stillMoving(mapState.direction)) stop = true;
				else {
					nextS = me.getSpace(mapState, mapState.direction);
					if (!nextS) {
						me.onleave(skyborn);
						stop = true;
					}
				}
				if (nextS && (nextS.oncollide(skyborn) || me.getSpace(mapState).onleave(skyborn))) stop = true;
			}
			if (stop) {
				clearInterval(interval);
				player.mapState.movement = null;
				direction = ih.getOtherDirection(direction);
				if (direction) me.movePlayer(ih, direction);
				return;
			}
			playerE = document.getElementById('player');
			playerE.parentElement.replaceChild(cm.getSprite('player', direction + 'Walk'), playerE);
			playerE = document.getElementById('player');
		}
	}, 20);
};

Map.prototype.removePlayerE = function() {
	// console.log('removePlayerE');
	var e = document.getElementById('player');
	if (e) e.parentElement.removeChild(e);
};

Map.prototype.interact = function(skyborn) {
	// console.log('interact');
	var player = skyborn.player;
	var mapState = player.mapState;
	var x = mapState.x;
	var y = mapState.y;
	switch (mapState.direction) {
	case 'left': x--; break;
	case 'up': y--; break;
	case 'right': x++; break;
	case 'down': y++; break;
	}
	if (!this.isValidSpace(x, y)) return;
	this.spaces[y][x].interact(skyborn);
};

Map.prototype.isValidSpace = function(x, y) {
	// console.log('isValidSpace');
	return y > -1 && x > -1 && y < this.spaces.length && x < this.spaces[y].length;
};

Map.prototype.getSpace = function(mapState, direction) {
	// console.log('getSpace');
	var x = mapState.x;
	var y = mapState.y;
	switch (direction) {
	case 'left': x--; break;
	case 'up': y--; break;
	case 'right': x++; break;
	case 'down': y++; break;
	}
	if (!this.isValidSpace(x, y)) return null;
	return this.spaces[y][x];
};

Map.prototype.openDoor = function(skyborn, door) {
	// console.log('openDoor');
	var mapState = skyborn.player.mapState;
	var x = mapState.x;
	var y = mapState.y;
	switch (mapState.direction) {
	case 'left': x--; break;
	case 'up': y--; break;
	case 'right': x++; break;
	case 'down': y++; break;
	}
	var e = document.getElementById('map').children[y].children[x];
	e.replaceChild(skyborn.cm.getImage(door), e.lastChild);
};

Map.prototype.closeDoor = function(skyborn, door) {
	// console.log('closeDoor');
	var mapState = skyborn.player.mapState;
	var e = document.getElementById('map').children[mapState.y].children[mapState.x];
	e.replaceChild(skyborn.cm.getImage(door), e.lastChild.previousSibling);
};

Map.prototype.replaceSpace = function(skyborn, space, x, y) {
	// console.log('replaceImage');
	var parentE = skyborn.es['map-container'].firstChild.children[2];
	parentE.replaceChild(this.drawSpace(skyborn.cm, space), parentE.firstChild);
};