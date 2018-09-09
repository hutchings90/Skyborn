const ENTER_KEY = 13;
const SHIFT_KEY = 16;
const CONTROL_KEY = 17;
const ESCAPE_KEY = 27;
const SPACE_KEY = 32
const PAGEUP_KEY = 33;
const PAGEDOWN_KEY = 34;
const END_KEY = 35;
const HOME_KEY = 36;
const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const A_KEY = 65;
const D_KEY = 68;
const S_KEY = 83;
const W_KEY = 87;

function InputHandler(skyborn) {
	this.keysDown = {};
	this.skyborn = skyborn;
}

InputHandler.prototype.activate = function() {
	// console.log('activate');
	var me = this;
	document.onkeydown = function(ev) {
		me.onkeydown(ev);
	}
	document.onkeyup = function(ev) {
		me.onkeyup(ev);
	}
	me.keysDown = {};
};

InputHandler.prototype.deactivate = function() {
	// console.log('deactivate');
	document.onkeydown = null;
	document.onkeyup = null;
	this.keysDown = {};
};

InputHandler.prototype.onkeydown = function(ev) {
	// console.log('default onkeydown');
	this.keysDown[ev.keyCode] = true;
};

InputHandler.prototype.onkeyup = function(ev) {
	// console.log('default onkeyup');
	this.keysDown[ev.keyCode] = false;
};