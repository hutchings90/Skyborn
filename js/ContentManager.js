const TILE_HEIGHT = 60;
const TILE_WIDTH = 60;
const ASSET_PATH = 'assets/';
const IMAGE_PATH = ASSET_PATH + 'images/';
const SOUND_PATH = ASSET_PATH + 'sounds/';
const QUEST_INSTRUCTION_IMAGE_HEIGHT = 660;
const QUEST_INSTRUCTION_IMAGE_WIDTH = 220;

function ContentManager() {
	// console.log('ContentManager');
	this.init();
}

ContentManager.prototype.getImage = function(key) {
	// console.log('getImage');
	return this.content[key].cloneNode(true);
};

ContentManager.prototype.getSprite = function(key, spriteKey) {
	// console.log('getSprite');
	return this.content[key][spriteKey].cloneNode(true);
};

ContentManager.prototype.getAudio = function(key, src) {
	// console.log('getAudio');
	return this.content[key].cloneNode(true);
};

ContentManager.prototype.makeSprite = function(key, srcs) {
	// console.log('makeSprite');
	var images = [];
	images.length = srcs.length;
	for (var i = srcs.length - 1; i >= 0; i--) {
		var src = srcs[i];
		images[src.key] = this.makeImage(IMAGE_PATH + src.name, TILE_HEIGHT, TILE_WIDTH, key);
	}
	this.content[key] = images;
};

ContentManager.prototype.makeTile = function(key, src) {
	// console.log('makeTile');
	this.content[key] = this.makeImage(IMAGE_PATH + src, TILE_HEIGHT, TILE_WIDTH);
};

ContentManager.prototype.makeQuestInstructionImage = function(key, src) {
	// console.log('makeQuestInstructionImage');
	this.content[key] = this.makeImage(IMAGE_PATH + src, QUEST_INSTRUCTION_IMAGE_HEIGHT, QUEST_INSTRUCTION_IMAGE_WIDTH, key);
};

ContentManager.prototype.makeImage = function(src, height, width, id) {
	// console.log('makeImage');
	var e = this.makeElement('img');
	if (id) {
		e.id = id;
	}
	e.src = src;
	e.height = height;
	e.width = width;
	return e;
};

ContentManager.prototype.makeAudio = function(key, src) {
	// console.log('makeAudio');
	var e = this.makeElement('audio');
	e.appendChild(this.makeElement('source'));
	e.firstChild.src = SOUND_PATH + src;
	this.content[key] = e;
};

ContentManager.prototype.makeElement = function(type) {
	// console.log('makeElement');
	return document.createElement(type);
};

ContentManager.prototype.init = function() {
	// console.log('init');
	this.content = {};
	this.initQuestInstructions();
	this.initTiles();
	this.initSounds();
	this.initSprites();
};

ContentManager.prototype.initQuestInstructions = function() {
	// console.log('initQuestInstructions');
	this.makeQuestInstructionImage('retrieveRingImage', 'retrieveRing.png');
};

ContentManager.prototype.initTiles = function() {
	// console.log('initTiles');
	this.makeTile('black', 'black.png');
	this.makeTile('water', 'water.gif');
	this.makeTile('mud', 'mud.png');
	this.makeTile('grass', 'grass.png');
	this.makeTile('dirt1', 'dirt1.png');
	this.makeTile('brick', 'brick.png');
	this.makeTile('rock1', 'rock1.png');
	this.makeTile('tree1', 'tree1.png');
	this.makeTile('rugLeft1', 'rugLeft1.png');
	this.makeTile('rugRight1', 'rugRight1.png');
	this.makeTile('tile1', 'tile1.png');
	this.makeTile('flower1', 'flower1.png');
	this.makeTile('door1', 'door1.png');
	this.makeTile('doorOpen1', 'doorOpen1.png');
	this.makeTile('houseExteriorWall', 'houseExteriorWall.png');
	this.makeTile('houseExteriorWallLeft', 'houseExteriorWallLeft.png');
	this.makeTile('houseExteriorWallRight', 'houseExteriorWallRight.png');
	this.makeTile('houseExteriorWallSign', 'houseExteriorWallSign.png');
	this.makeTile('houseRoof', 'houseRoof.png');
	this.makeTile('houseRoofLeft', 'houseRoofLeft.png');
	this.makeTile('houseRoofRight', 'houseRoofRight.png');
	this.makeTile('fence1Outside', 'fence1Outside.png');
	this.makeTile('fence1Inside', 'fence1Inside.png');
	this.makeTile('fence1Side', 'fence1Side.png');
	this.makeTile('fence1GateClosed', 'fence1GateClosed.png');
	this.makeTile('fence1GateOpen', 'fence1GateOpen.png');
	this.makeTile('wall1Front', 'wall1Front.png');
	this.makeTile('wall1Side', 'wall1Side.png');
	this.makeTile('stairs1BottomLeft', 'stairs1BottomLeft.png');
	this.makeTile('stairs1BottomRight', 'stairs1BottomRight.png');
	this.makeTile('stairs1Middle', 'stairs1Middle.png');
	this.makeTile('ringOfAndorisGif', 'ringOfAndoris.gif');
};

ContentManager.prototype.initSounds = function() {
	// console.log('initSounds');
	this.makeAudio('retrieveRingAudio', 'retrieveRing.wav');
	this.makeAudio('ringRetrievedAudio', 'ringRetrieved.wav');
};

ContentManager.prototype.initSprites = function() {
	// console.log('initSprites');
	this.makeSprite('player', [
		{name: 'playerLeft.png', key: 'left'},
		{name: 'playerLeftFrame.png', key: 'leftFrame'},
		{name: 'playerLeft.gif', key: 'leftWalk'},
		{name: 'playerLeftFrame.gif', key: 'leftWalkFrame'},
		{name: 'playerBack.png', key: 'up'},
		{name: 'playerBackFrame.png', key: 'upFrame'},
		{name: 'playerBack.gif', key: 'upWalk'},
		{name: 'playerBackFrame.gif', key: 'upWalkFrame'},
		{name: 'playerRight.png', key: 'right'},
		{name: 'playerRightFrame.png', key: 'rightFrame'},
		{name: 'playerRight.gif', key: 'rightWalk'},
		{name: 'playerRightFrame.gif', key: 'rightWalkFrame'},
		{name: 'playerFront.png', key: 'down'},
		{name: 'playerFrontFrame.png', key: 'downFrame'},
		{name: 'playerFront.gif', key: 'downWalk'},
		{name: 'playerFrontFrame.gif', key: 'downWalkFrame'}
	]);
	this.makeSprite('jester', [
		{name: 'jesterLeft.png', key: 'left'},
		{name: 'jesterBack.png', key: 'up'},
		{name: 'jesterRight.png', key: 'right'},
		{name: 'jesterFront.png', key: 'down'},
	]);
	this.makeSprite('character1M', [
		{name: 'character1MLeft.png', key: 'left'},
		{name: 'character1MBack.png', key: 'up'},
		{name: 'character1MRight.png', key: 'right'},
		{name: 'character1MFront.png', key: 'down'},
	]);
	this.makeSprite('character1F', [
		{name: 'character1FLeft.png', key: 'left'},
		{name: 'character1FBack.png', key: 'up'},
		{name: 'character1FRight.png', key: 'right'},
		{name: 'character1FFront.png', key: 'down'},
	]);
	this.makeSprite('character2M', [
		{name: 'character2MLeft.png', key: 'left'},
		{name: 'character2MBack.png', key: 'up'},
		{name: 'character2MRight.png', key: 'right'},
		{name: 'character2MFront.png', key: 'down'},
	]);
	this.makeSprite('character2F', [
		{name: 'character2FLeft.png', key: 'left'},
		{name: 'character2FBack.png', key: 'up'},
		{name: 'character2FRight.png', key: 'right'},
		{name: 'character2FFront.png', key: 'down'},
	]);
	this.makeSprite('character3M', [
		{name: 'character3MLeft.png', key: 'left'},
		{name: 'character3MBack.png', key: 'up'},
		{name: 'character3MRight.png', key: 'right'},
		{name: 'character3MFront.png', key: 'down'},
	]);
	this.makeSprite('character3F', [
		{name: 'character3FLeft.png', key: 'left'},
		{name: 'character3FBack.png', key: 'up'},
		{name: 'character3FRight.png', key: 'right'},
		{name: 'character3FFront.png', key: 'down'},
	]);
};