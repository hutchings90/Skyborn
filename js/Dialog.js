const NEW_LINE = '';
const TEXT_DISPLAY_RATE = 50;
const SCROLL_RATE = 20;
const SCROLL_INCREMENT = 2;

function Dialog(texts, onanswer, onend) {
	// console.log('Dialog');
	this.i = 0;
	this.texts = texts || [];
	this.onanswer = onanswer;
	this.onend = onend;
}

Dialog.prototype.getNextText = function() {
	// console.log('getNextText');
	if (this.i < 0 || this.i >= this.texts.length) return '';
	return this.texts[this.i++];
};

Dialog.prototype.restart = function() {
	// console.log('restart');
	this.i = 0;
};

Dialog.prototype.isPrompt = function() {
	// console.log('isPrompt');
	return this.onanswer != null;
};