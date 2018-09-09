function Utils() {}

Utils.prototype.timedNode = function(e, t) {
	// console.log('timedNode');
	var me = this;
	var func = function() {
		e.parentNode.removeChild(e);
		me.unsetTransitionListeners(e, func);
	};
	setTimeout(function() {
		e.className = 'fade-away';
		me.setTransitionListeners(e, func);
	}, t);
};

Utils.prototype.setTransitionListeners = function(e, func) {
	// console.log('setTransitionListeners');
	e.addEventListener('transitionend', func);
	e.addEventListener('oTransitionEnd', func);
	e.addEventListener('webkitTransitionEnd', func);
};

Utils.prototype.unsetTransitionListeners = function(e, func) {
	// console.log('unsetTransitionListeners');
	e.removeEventListener('transitionend', func);
	e.removeEventListener('oTransitionEnd', func);
	e.removeEventListener('webkitTransitionEnd', func);
};