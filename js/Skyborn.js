const SAVE_PREFIX = 'SKYBORN - ';
const REPORT_TIME = 3000;

function Skyborn() {
	// console.log('Skyborn');
	this.utils = new Utils();
	this.cm = new ContentManager();
	this.newGame();
}

Skyborn.prototype.loadDOM = function() {
	// console.log('loadDOM');
	var es = document.querySelectorAll('*[id]');
	this.es = {};
	for (var i = es.length - 1; i >= 0; i--) this.es[es[i].id] = es[i];
};

Skyborn.prototype.start = function() {
	// console.log('start');
	var map = document.getElementById('map');
	if (map) map.parentNode.removeChild(map);
	this.goToMap(this.player.mapState.mapI, this.player.mapState.x, this.player.mapState.y);
};

Skyborn.prototype.freshMaps = function() {
	// console.log('initMaps');
	return [Map1(), House1(), House2(), Map2(), Map3(), Map4(), Map5(), Map6(), Map7(), Map8(), Map9(), Map10(), House3()];
};

Skyborn.prototype.showGameMapMenu = function() {
	// console.log('showGameMapMenu');
	this.menuInputHandler = new MenuInputHandler(this, 'game-map-menu', 'closePlayerMapMenu');
	this.menuInputHandler.activate();
	this.menuInputHandler.show();
};

Skyborn.prototype.closeGameMapMenu = function() {
	// console.log('closeGameMapMenu');
	this.mapInputHandler.activate();
	this.menuInputHandler = null;
};

Skyborn.prototype.showPlayerMapMenu = function() {
	// console.log('showPlayerMapMenu');
	this.menuInputHandler = new MenuInputHandler(this, 'player-map-menu', 'closePlayerMapMenu');
	this.menuInputHandler.activate();
	this.menuInputHandler.show();
};

Skyborn.prototype.closePlayerMapMenu = function() {
	// console.log('closePlayerMapMenu');
	this.mapInputHandler.activate();
	this.menuInputHandler = null;
};

Skyborn.prototype.showPlayerPackMenu = function() {
	// console.log('showPlayerPackMenu');
	this.menuInputHandler = new MenuInputHandler(this, 'player-pack-menu', 'closePlayerPackMenu');
	this.populatePlayerPackMenu();
	this.menuInputHandler.activate();
	this.menuInputHandler.show();
};

Skyborn.prototype.populatePlayerPackMenu = function() {
	// console.log('populatePlayerPackMenu');
	var e = this.es['player-pack-menu'];
	while (e.lastChild) e.removeChild(e.lastChild);
	var items = this.player.pack.items;
	var keys = Object.keys(items);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var item = items[key];
		var itemE = document.createElement('div');
		var itemNameE = document.createElement('div');
		itemNameE.className = 'player-pack-menu-item-name';
		itemNameE.innerHTML = key;
		itemE.appendChild(itemNameE);
		if (item.count) {
			var itemCountE = document.createElement('div');
			itemCountE.className = 'player-pack-menu-item-count';
			itemCountE.innerHTML = 'x' + item.count || '';
			itemE.appendChild(itemCountE);
		}
		itemE.dataset.key = key;
		itemE.dataset.fromPack = true;
		itemE.dataset.type = 'item';
		e.appendChild(itemE);
	}
	e.appendChild(this.makeCloseE('closePlayerPackMenu'));
};

Skyborn.prototype.closePlayerPackMenu = function() {
	// console.log('closePlayerPackMenu');
	this.menuInputHandler = new MenuInputHandler(this, 'player-map-menu', 'closePlayerMapMenu')
	this.menuInputHandler.activate();
	this.menuInputHandler.show();
};

Skyborn.prototype.newGame = function() {
	// console.log('newGame');
	this.player = new Player(null, 0, 1, 7, 'down');
	this.am = null;
	this.maps = this.freshMaps();
	this.loadDOM();
	this.mapInputHandler = new MapInputHandler(this);
	this.questInstruction = null;
	this.mapDialogInputHandler = new MapDialogInputHandler(this);
	while (this.menuInputHandler) this.menuInputHandler.close();
	this.start();
};

Skyborn.prototype.goToMap = function(i, x, y) {
	// console.log('goToMap');
	this.player.mapState.mapI = i;
	this.player.mapState.movement = null;
	this.player.mapState.x = x;
	this.player.mapState.y = y;
	if (this.am) this.am.goToMap(this, this.player.mapState.mapI);
	else {
		this.am = this.maps[this.player.mapState.mapI];
		this.am.draw(this);
	}
};

Skyborn.prototype.report = function(string) {
	// console.log('report');
	var reportE = document.createElement('div');
	reportE.innerHTML = string;
	this.es['map-report'].appendChild(reportE);
	this.utils.timedNode(reportE, REPORT_TIME);
}

Skyborn.prototype.makeNewSaveE = function() {
	// console.log('makeNewSaveE');
	var e = document.createElement('input');
	e.id = 'new-save';
	e.placeholder = 'Enter new name';
	e.dataset.action = 'newSave';
	return e;
};

Skyborn.prototype.makeCloseE = function(action) {
	// console.log('makeCloseE');
	return this.makeMenuOption('Close', action);
};

Skyborn.prototype.makeMenuOption = function(innerHTML, action) {
	var e = document.createElement('div');
	e.innerHTML = innerHTML;
	e.dataset.action = action;
	return e;
};

Skyborn.prototype.showQuestInstructions = function(questInstruction, onend) {
	// console.log('showQuestInstructions');
	if (!onend) onend = EMPTY_FUNC;
	var me = this;
	var func = function() {
		if (me.questInstruction) me.questInstruction.close();
		me.questInstruction = questInstruction;
		me.questInstruction.start();
	};
	me.player.mapState.movement = null;
	if (me.am) me.am.erase(me, func);
	else func();
};

Skyborn.prototype.end = function() {
	// console.log('end');
	var me = this;
	if (this.am) this.am.erase(me, function() {
		me.cm.getAudio('endGameAudio').play();
	});
};