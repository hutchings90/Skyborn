function MenuInputHandler(skyborn, id, closeFuncName, i) {
	// console.log('MenuInputHandler');
	InputHandler.call(this, skyborn);
	this.e = skyborn.es[id];
	this.closeFuncName = closeFuncName;
	this.i = i || 0;
	this.enteringNewName = false;
}

MenuInputHandler.prototype = Object.create(InputHandler.prototype);
MenuInputHandler.prototype.constructor = MenuInputHandler;

MenuInputHandler.prototype.onkeydown = function(ev) {
	// console.log('onkeydown');
	this.keysDown[ev.keyCode] = true;
	switch (ev.keyCode) {
	case ESCAPE_KEY: this.close(); break;
	case SPACE_KEY: if (this.enteringNewName) break;
	case ENTER_KEY: this.chooseSelected(); break;
	case HOME_KEY: this.home(); break;
	case PAGEUP_KEY: this.pageUp(); break;
	case PAGEDOWN_KEY: this.pageDown(); break;
	case END_KEY: this.end(); break;
	case W_KEY: if (this.enteringNewName) break;
	case UP_KEY: this.selectUp(); break;
	case S_KEY: if (this.enteringNewName) break;
	case DOWN_KEY: this.selectDown(); break;
	}
	switch (ev.keyCode) {
	case HOME_KEY:
	case END_KEY:
	case SPACE_KEY: if (this.enteringNewName) break;
	case PAGEUP_KEY:
	case PAGEDOWN_KEY:
	case UP_KEY:
	case DOWN_KEY: ev.preventDefault();
	}
};

MenuInputHandler.prototype.home = function() {
	// console.log('home');
	if (this.enteringNewName) return;
	this.e.scrollTop = 0;
	this.changeSelection(0);
};

MenuInputHandler.prototype.pageUp = function() {
	// console.log('pageUp');
	var newI = this.findPageUpI();
	this.e.scrollTop -= this.e.clientHeight;
	this.changeSelection(newI);
};

MenuInputHandler.prototype.pageDown = function() {
	// console.log('pageDown');
	var newI = this.findPageDownI();
	this.e.scrollTop += this.e.clientHeight;
	this.changeSelection(newI);
};

MenuInputHandler.prototype.end = function() {
	// console.log('end');
	if (this.enteringNewName) return;
	this.e.scrollTop = this.e.scrollHeight;
	this.changeSelection(this.e.children.length - 1)
};

MenuInputHandler.prototype.findPageUpI = function() {
	// console.log('findPageUpI');
	var threshold = this.getSelectedE().offsetTop - this.e.clientHeight;
	for (var i = this.i; i >= 0; i--)
		if (this.e.children[i].offsetTop < threshold) return i + 1;
	return 0;
};

MenuInputHandler.prototype.findPageDownI = function() {
	// console.log('findPageDownI');
	var threshold = this.getSelectedE().offsetTop + this.e.clientHeight;
	for (var i = this.i, length = this.e.children.length; i < length; i++)
		if (this.e.children[i].offsetTop > threshold) return i - 1;
	return length - 1;
};

MenuInputHandler.prototype.show = function() {
	// console.log('show');
	if (this.e.className.indexOf(' show') == -1) {
		this.e.scrollTop = 0;
		this.e.className += ' show';
	}
	this.highlightSelected();
};

MenuInputHandler.prototype.close = function() {
	// console.log('close');
	this.deactivate();
	this.unhighlightSelected();
	this.e.className = this.e.className.replace(/ show/g, '');
	this.skyborn[this.closeFuncName]()
};

MenuInputHandler.prototype.selectUp = function() {
	// console.log('selectUp');
	this.changeSelection(this.i < 1 ? this.e.children.length - 1 : this.i - 1);
};

MenuInputHandler.prototype.selectDown = function() {
	// console.log('selectDown');
	this.changeSelection(this.i >= this.e.children.length - 1 ? 0 : this.i + 1);
};

MenuInputHandler.prototype.selectOption = function(option) {
	// console.log('selectOption');
	this.changeSelection(this.e.children.indexOf(option));
};

MenuInputHandler.prototype.changeSelection = function(i) {
	// console.log('changeSelection');
	if (!this.validI(i)) return;
	this.unhighlightSelected();
	this.i = i;
	this.highlightSelected();
};

MenuInputHandler.prototype.unhighlightSelected = function() {
	// console.log('unhighlightSelected');
	if (!this.validSelection()) return;
	var e = this.getSelectedE();
	if (e.tagName == 'INPUT') {
		e.blur();
		this.enteringNewName = false;
	}
	else {
		e.className = e.className.replace(/ selected-menu-button/g, '');
		e.className = e.className.replace(/ chosen-menu-button/g, '');
	}
};

MenuInputHandler.prototype.highlightSelected = function() {
	// console.log('highlightSelected');
	if (!this.validSelection()) return;
	var e = this.getSelectedE();
	if (e.tagName == 'INPUT') {
		this.enteringNewName = true;
		e.focus();
	}
	else {
		e.className += ' selected-menu-button';
		e.className = e.className.replace(/ chosen-menu-button/g, '');
	}
	this.scrollItemIntoView(e);
};

MenuInputHandler.prototype.chooseSelected = function() {
	// console.log('chooseSelected');
	var e = this.getSelectedE();
	if (e.tagName != 'INPUT') e.className = e.className.replace(/ selected-menu-button/g, '') + ' chosen-menu-button';
	switch (e.dataset.type) {
	case 'item': this.skyborn.report(this.useItem(e)); break;
	default:
		if (e.innerHTML == 'Close') this.close();
		else this.skyborn[e.dataset.action](e);
	}
};

MenuInputHandler.prototype.getSelectedE = function() {
	// console.log('getSelectedE');
	return this.e.children[this.i];
};

MenuInputHandler.prototype.validSelection = function() {
	// console.log('validSelection');
	return this.i < this.e.children.length && this.i >= 0;
};

MenuInputHandler.prototype.useItem = function(e) {
	// console.log('useItem');
	var report = '';
	if (e.dataset.fromPack) {
		var item = this.skyborn.player.pack.items[e.dataset.key];
		report = item.use(this.skyborn);
		if (item.count < 1) {
			this.skyborn.player.pack.removeItem(item.name, 1);
			e.parentNode.removeChild(e);
			this.highlightSelected();
		}
		else if (e.children.length == 2) e.children[1].innerHTML = 'x' + item.count;
	}
	return report;
};

MenuInputHandler.prototype.insertOption = function(e, i, after) {
	// console.log('insertOption');
	if (after) i++;
	this.e.insertBefore(e, this.e.children[i]);
};

MenuInputHandler.prototype.validI = function(i) {
	// console.log('validI');
	return i >= 0 && i < this.e.children.length;
};

MenuInputHandler.prototype.removeSelectedOption = function() {
	// console.log('removeSelectedOption');
	var e = this.e.children[this.i];
	e = e.parentNode.removeChild(e);
	if (this.i >= this.e.children.length) this.i = this.e.children.length - 1;
	this.highlightSelected();
	return e;
};

MenuInputHandler.prototype.scrollItemIntoView = function(e) {
	// console.log('scrollItemIntoView');
	if (this.e.clientHeight > this.e.scrollHeight) return;
	if (this.e.scrollTop > e.offsetTop) this.e.scrollTop = e.offsetTop;
	else if (this.e.scrollTop + this.e.clientHeight < e.offsetTop + e.clientHeight) this.e.scrollTop = e.offsetTop + e.clientHeight - this.e.clientHeight;
};