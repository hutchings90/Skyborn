function Map1() {
	// console.log('Map1');
	var m = new Map('brick', [
		new GenericPersonObject(1, 4, 'character1M', [ 'Welcome to the world of Skyborn! Do you know how we came to be?' ]),
		new GenericPersonObject(5, 9, 'character2F', [ 'That other guy always wants to tell about how we came to be.', 'Isn\'t he annoying?' ]),
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
		if (mapState.x != 0 || mapState.direction != 'left') return;
		skyborn.goToMap(3, 10, mapState.y);
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
		new RockObject(10, 0, 1),
		new RockObject(10, 10, 1)
	], function(skyborn) {
		var mapState = skyborn.player.mapState;
		switch (mapState.direction) {
		case 'left': ; break;
		case 'right': if (mapState.x == 10) skyborn.goToMap(0, 0, mapState.y); break;
		case 'up': if (mapState.y == 0) skyborn.goToMap(4, mapState.x, 10); break;
		case 'down': ; break;
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
		case 'left': break;
		case 'right': break;
		case 'up': 
			if (mapState.y == 0) {
				if (!m.ringStatus) skyborn.showQuestInstructions(new RetrieveRingQuestInstruction(skyborn), function(questInstruction) {
					questInstruction.ringStatus = QUEST_BEGUN;
				});
				else if (m.ringStatus == QUEST_BEGUN) {
					var ring = new RingOfAndoris();
					if (!skyborn.player.pack.hasItem(ring)) skyborn.mapDialogInputHandler.showMapDialog(new Dialog([ 'Come back when you have the ' + ring.name + '.' ]));
					else {
						skyborn.questInstruction.text = '';
						skyborn.showQuestInstructions();
					}
				}
				else if (m.ringStatus == QUEST_COMPLETE) skyborn.mapDialogInputHandler.showMapDialog(new Dialog([ 'The castle is closed.' ]));
			}
			break;
		case 'down': if (mapState.y == 10) skyborn.goToMap(3, mapState.x, 0); break;
		}
	});
	m.ringStatus = null;
	return m;
}

function ExitableHouse(mi, mx, my, ex, ey, flooring, mapObjects=[]) {
	// console.log('ExitableHouse');
	var exitFunc = function(skyborn) {
		if (skyborn.player.mapState.direction == 'down') {
			skyborn.goToMap(mi, mx, my);
			return true;
		}
	};
	mapObjects.push(new MapObject(ex, ey, [
		[ new Space('rugLeft1', false, true, null, null, null, exitFunc), new Space('rugRight1', false, true, null, null, null, exitFunc) ]
	]));
	return new Map(flooring, mapObjects);
}

function House1() {
	// console.log('House1');
	return ExitableHouse(0, 2, 4, 2, 10, 'tile1', [ new GenericPersonObject(1, 2, 'character1F', [ 'Oh, Hello! We don\'t often have guests.' ]) ]);
}

function House2() {
	// console.log('House2');
	return ExitableHouse(0, 8, 7, 7, 10, 'tile1', [ new GenericPersonObject(3, 4, 'character2M', [ 'Welcome! Make yourself at home.' ]) ]);
}