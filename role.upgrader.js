const utils = require('utils');
const AI = require('creepAI');

const roleUpgrader = {
	classes: [
		{
			type: "big",
			cost: 400,
			format: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
		},
		{
			type: "basic",
			cost: 200,
			format: [WORK, CARRY, MOVE]
		}
	]
};

roleUpgrader.run = creep => {
	if (creep.memory.upgrading && creep.carry.energy == 0) {
		creep.memory.upgrading = false;
		creep.say('🔄 harvest');
	}
	
	if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
		creep.memory.upgrading = true;
	}
	
	if (!creep.memory.upgrading) {
		AI.locateEnergySource(creep);
	} else {
		if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
			creep.moveTo(creep.room.controller);
		}
	}
};

roleUpgrader.spawn = spawner => {
	const role = 'upgrader';
	const currentEnergy = utils.currentAvailableBuildEnergy(spawner);
	
	roleUpgrader.classes.some(c => {
		if(c.cost <= currentEnergy){
			let newName = `${c.type} ${role}: ${utils.getRandomName()}`;
			console.log('Spawning new Beyonce: ' + newName);
			spawner.spawnCreep(c.format, newName, { memory: { role: role } });
			return true;
		}
	});
};

module.exports = roleUpgrader;