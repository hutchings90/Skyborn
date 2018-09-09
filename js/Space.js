function Space(key, isSprite, hideTerrain, onenter, interact, oncollide, onleave, enterTexts, interactTexts, collideTexts, leaveTexts) {
	// console.log('Space');
	this.key = key;
	this.isSprite = isSprite;
	this.hideTerrain = hideTerrain;
	if (onenter) this.onenter = onenter;
	if (interact) this.interact = interact;
	if (oncollide) this.oncollide = oncollide;
	if (onleave) this.onleave = onleave;
	this.enterDialog = enterTexts;
	this.interactDialog = interactTexts;
	this.collideDialog = collideTexts;
	this.leaveDialog = leaveTexts;
}

Space.prototype.onenter = function(skyborn) {
	// console.log('default onenter');
};

Space.prototype.interact = function(skyborn) {
	// console.log('default interact');
};

Space.prototype.oncollide = function(skyborn) {
	// console.log('default oncollide');
};

Space.prototype.onleave = function(skyborn) {
	// console.log('default onleave');
};

function CollidingSpace(key, isSprite, hideTerrain, onenter, interact, oncollide, onleave, enterTexts, interactTexts, collideTexts, leaveTexts) {
	// console.log('CollidingSpace');
	Space.call(this, key, isSprite, hideTerrain, onenter, interact, null || oncollide, onleave, enterTexts, interactTexts, collideTexts, leaveTexts);
}

CollidingSpace.prototype = Object.create(Space.prototype);
CollidingSpace.prototype.constructor = CollidingSpace;

CollidingSpace.prototype.oncollide = function(skyborn) {
	// console.log('default oncollide');
	return true;
};