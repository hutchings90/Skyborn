function Map1() {
	// console.log('Map1');
	var m = new Map('brick', [
		new GenericPersonObject(1, 4, 'character1M', [ 'Welcome to the world of Skyborn! Do you know how we came to be?' ], function(skyborn, answer) {
			switch (answer) {
			case 0: this.texts = [ 'Isn\'t it wonderful?' ]; break;
			case 1: this.texts = [ 'Well, then, let me tell you all about it. A long time ago, blah, blah, blah...' ]; break;
			};
			this.onanswer = null;
			this.restart();
		}),
		new GenericPersonObject(9, 8, 'character2F', [ 'That other guy always wants to tell about how we came to be.', 'Isn\'t he annoying?' ]),
		new GenericPersonObject(5, 9, 'soldier', [ 'You are forbidden from passing here.' ]),
		new HouseObject(1, 2, 1, 2, function(skyborn) {
			skyborn.am.openDoor(skyborn, 'doorOpen1');
			skyborn.goToMap(1, 2, 10);
			return true;
		}, [ 'Some Town,', 'First Owner' ]),
		new HouseObject(5, 5, 3, 2, function(skyborn) {
			skyborn.am.openDoor(skyborn, 'doorOpen1');
			skyborn.goToMap(2, 8, 10);
			return true;
		}, [ 'Some Town,', 'Second Owner' ]),
		new Flower1Object(9, 7),
		new FenceObject(0, 0, 11, -1, 'fence1', 'Inside', 'horizontal', true),
		new FenceObject(10, 1, 9, -1, 'fence1', 'Side', 'vertical', false),
		new FenceObject(0, 10, 11, 5, 'fence1', 'Outside', 'horizontal', true),
	], function(skyborn) {
		var mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': if (mapState.x == 0) {
				skyborn.goToMap(3, 10, mapState.y);
				return true;
			}
			break;
		case 'right': break;
		case 'up': break;
		case 'down': skyborn.end(); break;
		}
	});
	m.mapObjects[7].spaces[0][0].interact = function(skyborn) {
		if (!this.foundHiddenItem) {
			var item = new Herb();
			var text = skyborn.player.name + ' found ' +  item.name +'!';
			var errorReport = PACK_ERROR_REPORTS[skyborn.player.pack.addItem(item)];
			if (errorReport) text += item.name + ' could not be added. ' + errorReport;
			skyborn.mapDialogInputHandler.showMapDialog(new Dialog([ text ]));
			if (!errorReport) this.foundHiddenItem = true;
		}
	};
	m.refreshSpaces();
	return m;
}

function Map2() {
	// console.log('Map2');
	return new Map('brick', [
		new GenericPersonObject(2, 6, 'character1M', [ 'Hi there!', 'What\'s your name?', 'My name is Jake :)', 'We should grab lunch together one of these days!', 'I see you like to go to the gym!', 'After all that exercise you must be exhausted!', 'I\'ll bet you could use something to restore your strength.', 'An Herb should do just the trick!', 'Here you go!' ], null, function(skyborn) {
			var item = new Herb();
			var errorReport = PACK_ERROR_REPORTS[skyborn.player.pack.addItem(item)];
			if (errorReport) skyborn.mapDialogInputHandler.dialog = new Dialog([ 'Uh oh. It looks like you can\'t carry this! Come back when you have room. ' + errorReport ]);
			else {
				this.texts.pop();
				this.texts.pop();
				skyborn.mapDialogInputHandler.dialog = new Dialog([ 'Stranger gave you ' + item.name + '.' ]);
				this.onend = null;
			}
			return true;
		}),
		new GenericPersonObject(7, 8, 'character1F', [ 'Do you like the town?' ], function(skyborn, answer) {
			switch (answer) {
			case 0: this.texts = [ 'Oh, good! I really like it here, too.' ]; break;
			case 1: this.texts = [ 'What a shame.', 'I like it here quite a bit!' ]; break;
			};
			this.onanswer = null;
			this.restart();
		}),
		new RockRow(10, 0, 1, 'horizontal', 1),
		new RockRow(10, 10, 1, 'horizontal', 1)
	], function(skyborn) {
		var mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': if (mapState.x == 0) {
				skyborn.goToMap(11, 10, mapState.y);
				return true;
			}
			break;
		case 'right': if (mapState.x == 10) {
				skyborn.goToMap(0, 0, mapState.y);
				return true;
			}
			break;
		case 'up': if (mapState.y == 0) {
				skyborn.goToMap(4, mapState.x, 10);
				return true;
			}
			break;
		case 'down': if (mapState.y == 10) {
				skyborn.goToMap(10, mapState.x, 0); ;
				return true;
			}
			break;
		}
	});
}

function Map3() {
	var m = new Map('brick', [
		new FenceObject(0, 0, 3, -1, 'wall1', 'Front', 'horizontal', false),
		new FenceObject(8, 0, 3, -1, 'wall1', 'Front', 'horizontal', false),
		new FenceObject(10, 1, 10, -1, 'wall1', 'Side', 'vertical', false),
		new Stairs1(3, 0, 5, '', 'horizontal')
	], function(skyborn) {
		mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': if (mapState.x == 0) {
				skyborn.goToMap(5, 10, mapState.y);
				return true;
			}
			break;
		case 'right': break;
		case 'up': if (mapState.y == 0) {
				if (!m.ringStatus) skyborn.showQuestInstructions(new RetrieveRingQuestInstruction(skyborn));
				else if (m.ringStatus == QUEST_BEGUN) {
					var ring = new RingOfAndoris();
					if (!skyborn.player.pack.hasItem(ring)) skyborn.mapDialogInputHandler.showMapDialog(new Dialog([ 'Come back when you have the ' + ring.name + '.' ]));
					else skyborn.showQuestInstructions(new RingRetrievedQuestInstruction(skyborn));
				}
				else if (m.ringStatus == QUEST_COMPLETE) skyborn.mapDialogInputHandler.showMapDialog(new Dialog([ 'Thank you for your help!' ]));
				return true;
			}
			break;
		case 'down': if (mapState.y == 10) {
				skyborn.goToMap(3, mapState.x, 0);
				return true;
			}
			break;
		}
	});
	m.ringStatus = null;
	return m;
}

function Map4() {
	// console.log('Map4');
	return new Map('brick', [
		new TreeRow(0, 0, 11, 'horizontal', 1),
	], function(skyborn) {
		mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': if (mapState.x == 0) {
				skyborn.goToMap(6, 10, mapState.y);
				return true;
			}
			break;
		case 'right': if (mapState.x == 10) {
				skyborn.goToMap(4, 0, mapState.y);
				return true;
			}
			break;
		case 'up': break;
		case 'down': if (mapState.y == 10) {
				skyborn.goToMap(11, mapState.x, 0);
				return true;
			}
			break;
		}
	});
}

function Map5() {
	// console.log('Map4');
	return new Map('brick', [
		new TreeRow(0, 0, 11, 'horizontal', 1),
		new TreeRow(0, 0, 11, 'vertical', 1),
		new HouseObject(1, 1, 1, 2, function(skyborn) {
			skyborn.am.openDoor(skyborn, 'doorOpen1');
			skyborn.goToMap(12, 8, 10);
			return true;
		}, [ 'Some Town', 'Court Jester' ])
	], function(skyborn) {
		mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': break;
		case 'right': if (mapState.x == 10) {
				skyborn.goToMap(5, 0, mapState.y);
				return true;
			}
			break;
		case 'up': break;
		case 'down': if (mapState.y == 10) {
				skyborn.goToMap(7, mapState.x, 0);
				return true;
			}
			break;
		}
	});
}

function Map6() {
	// console.log('Map6');
	var m = new Map('mud', [
		new RockRow(0, 0, 3, 'vertical', 1),
		new WaterRow(0, 3, 5, 'vertical'),
		new RockRow(0, 8, 3, 'vertical', 1),
	], function(skyborn) {
		mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': break;
		case 'right': if (mapState.x == 10) {
				skyborn.goToMap(11, 0, mapState.y);
				return true;
			}
			break;
		case 'up': if (mapState.y == 0) {
				skyborn.goToMap(6, mapState.x, 10);
				return true;
			}
			break;
		case 'down': if (mapState.y == 10) {
				skyborn.goToMap(8, mapState.x, 0);
				return true;
			}
			break;
		}
	});
	var ring = new RingOfAndoris();
	var mo = m.mapObjects[0];
	var space = mo.spaces[2][0];
	space.key = 'ringOfAndorisGif';
	space.interact = function(skyborn) {
		if (!skyborn.player.pack.addItem(ring)) {
			space.interact = EMPTY_FUNC;
			space.key = 'rock1';
			skyborn.am.replaceSpace(skyborn, space, 0, 2);
			skyborn.report('Found ' + ring.name + '!');
		}
	};
	return m;
}

function Map7() {
	// console.log('Map7');
	return new Map('grass', [
		new TreeRow(0, 0, 11, 'vertical', 1),
		new TreeRow(1, 10, 10, 'horizontal', 1),
	], function(skyborn) {
		mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': break;
		case 'right': if (mapState.x == 10) {
				skyborn.goToMap(9, 0, mapState.y);
				return true;
			}
			break;
		case 'up': if (mapState.y == 0) {
				skyborn.goToMap(7, mapState.x, 10);
				return true;
			}
			break;
		case 'down': break;
		}
	});
}

function Map8() {
	// console.log('Map8');
	return new Map('grass', [
		new TreeRow(0, 10, 11, 'horizontal', 1)
	], function(skyborn) {
		mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': if (mapState.x == 0) {
				skyborn.goToMap(8, 10, mapState.y);
				return true;
			}
			break;
		case 'right': if (mapState.x == 10) {
				skyborn.goToMap(10, 0, mapState.y);
				return true;
			}
			break;
		case 'up': if (mapState.y == 0) {
				skyborn.goToMap(11, mapState.x, 10);
				return true;
			}
			break;
		case 'down': break;
		}
	});
}

function Map9() {
	// console.log('Map9');
	return new Map('grass', [
		new TreeRow(10, 0, 11, 'vertical', 1),
		new TreeRow(0, 10, 10, 'horizontal', 1),
	], function(skyborn) {
		mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': if (mapState.x == 0) {
				skyborn.goToMap(9, 10, mapState.y);
				return true;
			}
			break;
		case 'right': break;
		case 'up': if (mapState.y == 0) {
				skyborn.goToMap(3, mapState.x, 10);
				return true;
			}
			break;
		case 'down': break;
		}
	});
}

function Map10() {
	// console.log('Map10');
	return new Map('grass', [], function(skyborn) {
		mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': if (mapState.x == 0) {
				skyborn.goToMap(7, 10, mapState.y);
				return true;
			}
			break;
		case 'right': if (mapState.x == 10) {
				skyborn.goToMap(3, 0, mapState.y);
				return true;
			}
			break;
		case 'up': if (mapState.y == 0) {
				skyborn.goToMap(5, mapState.x, 10);
				return true;
			}
			break;
		case 'down': if (mapState.y == 10) {
				skyborn.goToMap(9, mapState.x, 0);
				return true;
			}
			break;
		}
	});
}

function ExitableHouse(mi, mx, my, ex, ey, flooring, mapObjects) {
	// console.log('ExitableHouse');
	if (!mapObjects) mapObjects = [];
	mapObjects.push(new MapObject(ex, ey, [
		[ new Space('rugLeft1', false, true), new Space('rugRight1', false, true) ]
	]));
	return new Map(flooring, mapObjects, function(skyborn) {
		var mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': break;
		case 'right': break;
		case 'up': break;
		case 'down': if (mapState.y == ey && (mapState.x == ex || mapState.x == ex + 1)) {
				skyborn.goToMap(mi, mx, my);
				return true;
			}
			break;
		}
	});
}

function House1() {
	// console.log('House1');
	return ExitableHouse(0, 2, 4, 2, 10, 'tile1', [ new GenericPersonObject(1, 2, 'character1F', [ 'Oh, Hello! We don\'t often have guests.' ]) ]);
}

function House2() {
	// console.log('House2');
	return ExitableHouse(0, 8, 7, 7, 10, 'tile1', [ new GenericPersonObject(3, 4, 'character2M', [ 'Welcome! Make yourself at home.' ]) ]);
}

function House3() {
	return ExitableHouse(6, 2, 3, 7, 10, 'tile1', [ new GenericPersonObject(3, 4, 'jester', [ 'I played the best prank on the king yet! yuk, yuk, yuk' ]) ]);
}