const QUEST_TITLE_DISPLAY_RATE = TEXT_DISPLAY_RATE * 2;
const QUEST_TEXT_DISPLAY_RATE = TEXT_DISPLAY_RATE;
const QUEST_BEGUN = 'begun';
const QUEST_COMPLETE = 'complete';

function QuestInstruction(skyborn, image, texts, onend) {
	// console.log('QuestInstruction');
	var e = document.getElementById('quest-instruction-container');
	while (e.lastChild) e.removeChild(e.lastChild);
	this.skyborn = skyborn;
	this.image = image;
	this.texts = texts;
	this.i = 0;
	this.text = '';
	this.textI = 0;
	this.textInterval = null;
	this.onend = onend || function(){};
	e.appendChild(this.getDisplays());
	this.e = e.firstChild;
}

QuestInstruction.prototype.start = function() {
	// console.log('start');
	this.e.className = 'open';
	this.play();
};

QuestInstruction.prototype.close = function() {
	// console.log('close');
	var me = this;
	me.e.className = 'close';
	var func = function() {
		me.skyborn.utils.unsetTransitionListeners(me.e, func);
		me.onend(me.skyborn);
	};
	me.skyborn.utils.setTransitionListeners(me.e, func);
};

QuestInstruction.prototype.getDisplays = function() {
	console.log();
	var e = document.createElement('div');
	e.appendChild(this.textDisplay());
	e.appendChild(this.imageDisplay());
	return e;
};

QuestInstruction.prototype.textDisplay = function() {
	// console.log('textDisplay');
	var e = document.createElement('div');
	e.className = 'quest-instruction-text';
	return e;
};

QuestInstruction.prototype.imageDisplay = function() {
	// console.log('imageDisplay');
	var e = this.image;
	e.className = 'quest-instruction-image';
	return e;
};

QuestInstruction.prototype.play = function() {
	// console.log('play');
	this.displayTitle();
};

QuestInstruction.prototype.displayTitle = function() {
	// console.log('displayTitle');
	var me = this;
	me.i = 0;
	me.text = me.texts[me.i++];
	me.addTextToDisplay('quest-instruction-text-title');
	me.textInterval = setInterval(function() {
		if (me.textI < me.text.length) me.e.firstChild.lastChild.innerHTML += me.text[me.textI++];
		else {
			clearInterval(me.textInterval);
			me.text = me.texts[me.i++];
			me.addTextToDisplay('quest-instruction-text-text');
			setTimeout(function() {
				me.displayTexts();
			}, 500);
		}
	}, QUEST_TITLE_DISPLAY_RATE);
};

QuestInstruction.prototype.displayTexts = function() {
	// console.log('displayTexts');
	var me = this;
	me.textI = 0;
	me.textInterval = setInterval(function() {
		if (me.textI >= me.text.length) {
			if (me.i >= me.texts.length) {
				clearInterval(me.textInterval);
				clearInterval(me.autoScroll);
				document.onkeydown = function(ev) {
					switch (ev.keyCode) {
					case ENTER_KEY:
					case SPACE_KEY:
					case ESCAPE_KEY: me.close(); break;
					}
				};
				return;
			}
			me.addTextToDisplay('quest-instruction-text-text');
			me.text = me.texts[me.i++];
			me.textI = 0;
		}
		me.e.firstChild.lastChild.innerHTML += me.text[me.textI++];
	}, QUEST_TEXT_DISPLAY_RATE);
	me.scrollInterval = setInterval(function() {
		var prev = me.e.firstChild.scrollTop;
		me.e.firstChild.scrollTop += SCROLL_INCREMENT;
		if (!me.autoScroll && me.e.firstChild.scrollTop != prev + SCROLL_INCREMENT) clearInterval(me.scrollInterval);
	}, SCROLL_RATE);
};

QuestInstruction.prototype.addTextToDisplay = function(className) {
	// console.log('addTextToDisplay');
	var e = document.createElement('div');
	e.className = className;
	this.e.firstChild.appendChild(e);
};