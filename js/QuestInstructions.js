function RetrieveRingQuestInstruction(skyborn) {
	// console.log('QuestInstruction');
	var ring = new RingOfAndoris().name;
	QuestInstruction.call(this, skyborn, skyborn.cm.getImage('retrieveRing'), [
		'The ' + ring,
		'Welcome, ' + skyborn.player.name + '! I understand you wish to embark on your own adventure and do something cool. I would be happy to help you, but first I need your help.',
		'Many years ago a ring came into my possession. This was no ordinary ring. It had magical powers. These powers helped me secure the throne and establish peace in this land.',
		'I\'m embarrassed to say that I have lost it. Just yesterday I wore it on my finger. I took it off and left it only for a moment. When I came back, it was nowhere to be found.',
		'If you find my magic ring, the ' + ring + ', and bring it back to me, then you will receive my help.'
	], function(skyborn) {
		skyborn.player.mapState.direction = 'down';
		skyborn.maps[4].ringStatus = QUEST_BEGUN;
		skyborn.goToMap(4, skyborn.player.mapState.x, skyborn.player.mapState.y);
	});
}

RetrieveRingQuestInstruction.prototype = Object.create(QuestInstruction.prototype);
RetrieveRingQuestInstruction.constructor = RetrieveRingQuestInstruction;