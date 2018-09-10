const QUEST_SCROLL_INCREMENT = 2;
const QUEST_SCROLL_RATE = 70;
const QUEST_BEGUN = 'begun';
const QUEST_COMPLETE = 'complete';

function QuestInstruction(skyborn, image, audio, texts, onend) {
	// console.log('QuestInstruction');
	this.e = document.getElementById('quest-instruction-container');
	this.titleE = this.e.children[0].children[0];
	this.textE = this.e.children[0].children[1];
	this.clearElement(this.titleE);
	this.clearElement(this.textE);
	this.ended = false;
	this.skyborn = skyborn;
	this.image = image;
	this.texts = texts;
	this.audio = audio;
	this.onend = onend || function(){};
	this.setTitle();
	this.setText();
	this.setImage();
	this.setAudio();
	this.setKeys();
	this.scrollIncrement = null;
	this.ended = false;
}

QuestInstruction.prototype.setKeys = function() {
	// console.log('setKeys');
	this.keysDown = {};
	this.keysUp = {};
};

QuestInstruction.prototype.clearElement = function(e) {
	// console.log('clearElement');
	while (e.lastChild) e.removeChild(e.lastChild);
};

QuestInstruction.prototype.start = function() {
	// console.log('start');
	this.e.className = 'open';
	this.play();
};

QuestInstruction.prototype.close = function() {
	// console.log('close');
	var me = this;
	me.deactivate();
	me.e.className = 'close';
	var func = function() {
		me.skyborn.utils.unsetTransitionListeners(me.e, func);
		me.onend(me.skyborn);
	};
	me.skyborn.utils.setTransitionListeners(me.e, func);
};

QuestInstruction.prototype.setText = function() {
	// console.log('setText');
	for (var i = 1, length = this.texts.length; i < length; i++)
		this.addTextToDisplay('\t' + this.texts[i]);
	this.addTextToDisplay('END');
	var padding = (660 - this.titleE.clientHeight);
	this.textE.padding = padding;
	this.textE.style.height = padding + 'px';
	this.textE.firstChild.style.paddingTop = padding + 'px';
	this.textE.lastChild.style.paddingBottom = padding + 'px';
};

QuestInstruction.prototype.setImage = function() {
	// console.log('setImage');
	this.e.replaceChild(this.image, this.e.children[1]);
};

QuestInstruction.prototype.setAudio = function() {
	// console.log('setAudio');
	var me = this;
	me.audio.onended = function() {
		me.ended = true;
		me.activate();
	};
	me.e.replaceChild(me.audio, me.e.children[2]);
};

QuestInstruction.prototype.play = function() {
	// console.log('play');
	var me = this;
	setTimeout(function() {
		me.scroll(QUEST_SCROLL_INCREMENT);
		me.e.children[2].play();
	}, 3000);
};

QuestInstruction.prototype.setTitle = function() {
	// console.log('setTitle');
	this.titleE.innerHTML = this.texts[0];
};

QuestInstruction.prototype.addTextToDisplay = function(text) {
	// console.log('addTextToDisplay');
	var e = document.createElement('div');
	e.className = 'quest-instruction-text-text';
	e.innerHTML = text;
	this.textE.appendChild(e);
};

QuestInstruction.prototype.activate = function() {
	// console.log('activate');
	var me = this;
	me.setKeys();
	document.onkeydown = function(ev) {
		if (me.keysDown[ev.keyCode]) return;
		me.keysDown[ev.keyCode] = true;
		switch (ev.keyCode) {
		case ENTER_KEY:
		case SPACE_KEY:
		case ESCAPE_KEY: me.close(); break;
		case W_KEY:
		case UP_KEY: me.scroll(-QUEST_SCROLL_INCREMENT); break;
		case S_KEY:
		case DOWN_KEY: me.scroll(QUEST_SCROLL_INCREMENT); break;
		case PAGEUP_KEY: me.setScrollTop(me.textE.scrollTop - me.textE.clientHeight); break;
		case PAGEDOWN_KEY: me.setScrollTop(me.textE.scrollTop + me.textE.clientHeight); break;
		case HOME_KEY: me.home(); break;
		case END_KEY: me.end(); break;
		}
	};

	document.onkeyup = function(ev) {
		me.keysDown[ev.keyCode] = false;
		switch (ev.keyCode) {
		case W_KEY:
		case UP_KEY: me.stopScrolling(-QUEST_SCROLL_INCREMENT); break;
		case S_KEY:
		case DOWN_KEY: me.stopScrolling(QUEST_SCROLL_INCREMENT); break;
		}
	}
};

QuestInstruction.prototype.deactivate = function() {
	// console.log('deactivate');
	document.onkeydown = null;
};

QuestInstruction.prototype.scroll = function(scrollIncrement) {
	// console.log('scroll');
	var me = this;
	if (me.scrollInterval) clearInterval(me.scrollInterval);
	var e = me.textE;
	me.scrollIncrement = scrollIncrement;
	me.scrollInterval = setInterval(function() {
		e.scrollTop += me.scrollIncrement;
		if (e.scrollTop < 1 || e.scrollTop >= e.scrollHeight - e.clientHeight) {
			clearInterval(me.scrollInterval);
			if (!me.ended) {
				me.ended = true;
				me.activate();
			}
		}
	}, QUEST_SCROLL_RATE);
};

QuestInstruction.prototype.stopScrolling = function(scrollIncrement) {
	// console.log('stopScrolling');
	if (this.scrollIncrement == scrollIncrement) {
		this.scrollIncrement = null;
		clearInterval(this.scrollInterval);
	}
};

QuestInstruction.prototype.setScrollTop = function(scrollTop) {
	// console.log('setScrollTop');
	clearInterval(this.scrollInterval);
	if (scrollTop < this.textE.padding) scrollTop = this.textE.padding;
	else if (scrollTop > this.textE.padding + this.textE.clientHeight) scrollTop = this.textE.scrollHeight - this.textE.padding;
	this.textE.scrollTop = scrollTop;
};

QuestInstruction.prototype.home = function() {
	// console.log('home');
	this.setScrollTop(this.textE.padding);
};

QuestInstruction.prototype.end = function() {
	// console.log('end');
	this.setScrollTop(this.textE.scrollHeight - this.textE.padding);
};