const utils = require('utils');
const roleUpgrader = {};

roleUpgrader.run = creep => {
	if (creep.memory.upgrading && creep.carry.energy == 0) {
		creep.memory.upgrading = false;
		creep.say('🔄 harvest');
	}
	
	if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
		creep.memory.upgrading = true;
	}
	
	
	
	if (!creep.memory.upgrading) {
		const notEmptyContainerFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] > 0);
		const containers = creep.room.find(FIND_STRUCTURES, {filter: notEmptyContainerFilter});
		
		if(containers.length){
			if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#FFE56D' } });
			}
		}
		else {
			const sources = creep.room.find(FIND_SOURCES);

			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#FFE56D' } });
			}
		}
	} else {
		if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
			creep.moveTo(creep.room.controller);
		}
	}
};

roleUpgrader.spawn = spawner => {
	const role = 'upgrader';
	const currentEnergy = utils.currentAvailableBuildEnergy(spawner);
	
	const classes = [
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
	];
	
	classes.some(c => {
		if(c.cost <= currentEnergy){
			let newName = c.type + " " + role + Game.time;
			console.log('Spawning new Beyonce: ' + newName);
			spawner.spawnCreep(c.format, newName, { memory: { role: role } });
			return true;
		}
	});
};

module.exports = roleUpgrader;