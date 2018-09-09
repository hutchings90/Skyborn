const DIALOG_LINE_HEIGHT = 18;
const MAP_DIALOG_HEIGHT = 90;

function MapDialogInputHandler(skyborn) {
	// console.log('MapDialogInputHandler');
	InputHandler.call(this, skyborn);
	this.e = skyborn.es['map-dialog'];
	this.isClosable = true;
	this.dialog = null;
	this.text = '';
	this.i = 0;
	this.activePromptButtonI = 0;
	this.isPrompting = false;
	this.dy = 0;
	this.autoScroll = true;
	this.textInterval = null;
	this.scrollInterval = null;
}

MapDialogInputHandler.prototype = Object.create(InputHandler.prototype);
MapDialogInputHandler.prototype.constructor = MapDialogInputHandler;

MapDialogInputHandler.prototype.onkeydown = function(ev) {
	// console.log('onkeydown');
	switch (ev.keyCode) {
	case ESCAPE_KEY: if (this.canClose()) this.hideMapDialog(); break;
	case SPACE_KEY: if (!this.keysDown[SPACE_KEY]) this.interact(); break;
	case PAGEUP_KEY:
		this.stopScrolling();
		this.autoScroll = false;
		this.e.scrollTop -= MAP_DIALOG_HEIGHT;
		break;
	case PAGEDOWN_KEY:
		this.stopScrolling();
		this.autoScroll = false;
		this.e.scrollTop += MAP_DIALOG_HEIGHT;
		break;
	case END_KEY:
		this.stopScrolling();
		this.autoScroll = false;
		this.e.scrollTop = this.e.scrollHeight - this.e.clientHeight;
		break;
	case HOME_KEY:
		this.stopScrolling();
		this.autoScroll = false;
		this.e.scrollTop = 0;
		break;
	case W_KEY:
	case UP_KEY: this.scrollText(-2); break;
	case S_KEY:
	case DOWN_KEY: this.scrollText(2); break;
	case D_KEY:
	case RIGHT_KEY: this.selectPrompt(-1); break;
	case A_KEY:
	case LEFT_KEY: this.selectPrompt(1); break;
	default: return;
	}
	this.keysDown[ev.keyCode] = true;
	ev.preventDefault();
};

MapDialogInputHandler.prototype.onkeyup = function(ev) {
	// console.log('onkeyup');
	this.keysDown[ev.keyCode] = false;
	switch (ev.keyCode) {
	case W_KEY:
	case UP_KEY: this.stopScrolling(); break;
	case DOWN_KEY:
	case S_KEY: this.stopScrolling(); break;
	default: return;
	}
	ev.preventDefault();
};

MapDialogInputHandler.prototype.showMapDialog = function(dialog, isClosable=true) {
	// console.log('showMapDialog');
	this.activate();
	this.isClosable = isClosable;
	this.dialog = dialog;
	this.dialog.restart();
	this.text = this.dialog.getNextText();
	this.textI = 0;
	this.eI = 0;
	this.isPrompting = false;
	this.setTextInterval();
};

MapDialogInputHandler.prototype.setTextInterval = function() {
	// console.log('setTextInterval');
	var me = this;
	me.isPrompting = false;
	me.autoScroll = true;
	me.scrollText(SCROLL_INCREMENT, true);
	me.textInterval = setInterval(function() {
		if (me.textI >= me.text.length) {
			me.getNextText();
			if (!me.text) {
				me.clearTextInterval(me.textInterval);
				if (me.dialog.isPrompt()) me.showPrompt();
				return;
			}
		}
		if (me.textI == 0) me.e.appendChild(document.createElement('li'));
		me.e.children[me.eI].innerHTML += me.text[me.textI++];
	}, TEXT_DISPLAY_RATE);
	me.e.className += ' show';
};

MapDialogInputHandler.prototype.hideMapDialog = function() {
	// console.log('hideMapDialog');
	if (!this.textInterval && !this.isPrompting && this.dialog && this.dialog.i >= this.dialog.texts.length && this.dialog.onend) {
		if (this.dialog.onend(this.skyborn)) {
			if (!this.textInterval) this.setTextInterval();
			return;
		}
	}
	this.clearTextInterval(this.textInterval);
	this.e.className = this.e.className.replace(/ show/g, '');
	this.e.innerHTML = '';
	this.skyborn.mapInputHandler.activate();
	if (this.dialog) this.dialog.restart();
};

MapDialogInputHandler.prototype.scrollText = function(dy, autoScroll=false) {
	// console.log('scrollText');
	var me = this;
	me.autoScroll = autoScroll;
	if (!me.autoScroll) {
		if (me.e.scrollHeight == me.e.clientHeight || dy == me.dy) return;
		if (!me.canScrollInDirection(dy)) return false;
	}
	clearInterval(me.scrollInterval);
	me.dy = dy;
	me.scrollInterval = setInterval(function() {
		// console.log('scrollInterval');
		var prev = me.e.scrollTop;
		me.e.scrollTop += me.dy;
		if (!me.autoScroll && me.e.scrollTop != prev + me.dy) me.stopScrolling();
	}, SCROLL_RATE);
};

MapDialogInputHandler.prototype.stopScrolling = function() {
	// console.log('stopScrolling');
	clearInterval(this.scrollInterval);
	this.dy = 0;
};

MapDialogInputHandler.prototype.canScrollInDirection = function(dy) {
	// console.log('canScrollInDirection');
	return (dy < 0 && this.e.scrollTop > 0) || (dy > 0 && this.e.clientHeight < this.e.scrollHeight - this.e.scrollTop );
};

MapDialogInputHandler.prototype.clearTextInterval = function() {
	// console.log('clearTextInterval');
	clearInterval(this.textInterval);
	this.textInterval = null;
};

MapDialogInputHandler.prototype.showPrompt = function() {
	// console.log('showPrompt');
	var e = document.createElement('div');
	e.className = 'active-prompt';
	e.appendChild(this.makePromptButton('Yes'));
	e.lastChild.className += ' selected-prompt-button';
	e.appendChild(this.makePromptButton('No'));
	this.activePromptButtonI = 0;
	this.isPrompting = true;
	this.e.appendChild(e);
	this.eI++;
};

MapDialogInputHandler.prototype.makePromptButton = function(text) {
	// console.log('makePromptButton');
	var e = document.createElement('div');
	e.className = 'prompt-button';
	e.innerHTML = text;
	return e;
};

MapDialogInputHandler.prototype.getNextText = function() {
	// console.log('getNextText');
	this.text = this.dialog.getNextText();
	this.textI = 0;
	if (this.text) this.eI++;
};

MapDialogInputHandler.prototype.interact = function() {
	// console.log('interact');
	if (this.textInterval) this.finishText();
	else if (this.isPrompting) this.answer();
	else this.hideMapDialog();
};

MapDialogInputHandler.prototype.finishText = function() {
	// console.log('finishText');
	this.clearTextInterval();
	this.e.lastChild.innerHTML = this.text;
	this.getNextText();
	if (!this.text) {
		if (this.dialog.isPrompt()) this.showPrompt();
		return;
	}
	this.setTextInterval();
};

MapDialogInputHandler.prototype.answer = function() {
	// console.log('answer');
	var e = this.e.lastChild.children[this.activePromptButtonI];
	e.className = e.className.replace(/ selected-prompt-button/g, '') + ' chosen-prompt-button';
	this.dialog.onanswer(this.skyborn, this.activePromptButtonI);
	this.setTextInterval();
};

MapDialogInputHandler.prototype.selectPrompt = function(di) {
	// console.log('selectPrompt');
	if (!this.isPrompting) return;
	var es = this.e.lastChild.children;
	var e = es[this.activePromptButtonI];
	e.className = e.className.replace(/ selected-prompt-button/g, '');
	this.activePromptButtonI = Math.abs(this.activePromptButtonI + di) % 2;
	es[this.activePromptButtonI].className += ' selected-prompt-button';
};

MapDialogInputHandler.prototype.canClose = function() {
	// console.log('canClose');
	if (this.isClosable) return true;
	return !this.isPrompting && (this.isClosable || this.dialog.isFinished());
};