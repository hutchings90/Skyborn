function RetrieveRingQuestInstruction(skyborn) {
	// console.log('QuestInstruction');
	var ring = new RingOfAndoris().name;
	QuestInstruction.call(this, skyborn, skyborn.cm.getImage('retrieveRingImage'), skyborn.cm.getAudio('retrieveRingAudio'), [
		'The ' + ring,
		'Welcome! I understand you wish to embark on your own adventure and do something cool. I would be happy to help you, but first I need your help.',
		'Many years ago a ring came into my possession. This was no ordinary ring. It had magical powers. These powers helped me secure the throne and establish peace in this land.',
		'I\'m embarrassed to say that I have lost it. Just yesterday I wore it on my finger. I took it off and left it for just a moment. When I came back, it was nowhere to be found.',
		'If you find my magic ring, the ' + ring + ', and bring it back to me, then you will receive my help.'
	], function(skyborn) {
		skyborn.player.mapState.direction = 'down';
		skyborn.maps[4].ringStatus = QUEST_BEGUN;
		skyborn.goToMap(4, skyborn.player.mapState.x, skyborn.player.mapState.y);
		skyborn.questInstruction = null;
	});
}

RetrieveRingQuestInstruction.prototype = Object.create(QuestInstruction.prototype);
RetrieveRingQuestInstruction.constructor = RetrieveRingQuestInstruction;

function RingRetrievedQuestInstruction(skyborn) {
	// console.log('RingRetrievedQuestInstruction');
	var ring = new RingOfAndoris().name;
	QuestInstruction.call(this, skyborn, skyborn.cm.getImage('retrieveRingImage'), skyborn.cm.getAudio('ringRetrievedAudio'), [
		'The ' + ring,
		'Why, you\'ve done it! You\'ve found the ' + ring + '!',
		'Very well, brave one. I will help you.',
		'The guard at the entrance to the town will allow you to pass through now.',
		'Farewell!'
	], function(skyborn) {
		var guard = skyborn.maps[0].mapObjects[2];
		guard.x = 6;
		guard.spaces[0][0].interactDialog.texts = [ 'I heard about the assistance you provided to the king! As a token of appreciation for your honorable act, you are allowed to pass through now.' ];
		skyborn.player.mapState.direction = 'down';
		skyborn.maps[4].ringStatus = QUEST_COMPLETE;
		skyborn.maps[0].refreshSpaces();
		skyborn.goToMap(4, skyborn.player.mapState.x, skyborn.player.mapState.y);
		skyborn.questInstruction = null;
	});
}

RingRetrievedQuestInstruction.prototype = Object.create(QuestInstruction.prototype);
RingRetrievedQuestInstruction.constructor = RingRetrievedQuestInstruction;