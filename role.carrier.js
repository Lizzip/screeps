const utils = require('utils');
const roleCarrier = {};

roleCarrier.run = creep => {
	if (!creep.memory.gathering && creep.carry.energy == 0) {
		creep.memory.gathering = true;
		creep.say('gather');
	}
	
	if (creep.memory.gathering && creep.carry.energy == creep.carryCapacity) {
		creep.memory.gathering = false;
		creep.say('offload');
	}
	
	if(creep.memory.gathering){
		//Pick up any dropped energy before emptying containers
		const droppedEnergyFilter = d => (d.amount > 99 && d.resourceType == RESOURCE_ENERGY);
		const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: droppedEnergyFilter});

		if(droppedEnergy){
			if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
				creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: '#ffffff' } });
			}
		}
		else {
			const notEmptyContainerFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] > 0);
			const containers = creep.room.find(FIND_STRUCTURES, {filter: notEmptyContainerFilter});
			
			//Sort containers by store (creep picks from container holding most energy)
			if(containers.length > 1){
				containers.sort((c1,c2) => c1.store[RESOURCE_ENERGY] < c2.store[RESOURCE_ENERGY]);
			}
			
			if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffffff' } });
			}
		}
	}
	else {
		const targetsFilter = s => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity;
		const targets = creep.room.find(FIND_STRUCTURES, {filter: targetsFilter});
		
		if (targets.length > 0) {
			if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
			}
		} else {
			//If we can't provide for anything then be an upgrader
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}
		}
	}	
};

roleCarrier.spawn = spawner => {
	const role = 'carrier';
	const currentEnergy = utils.currentAvailableBuildEnergy(spawner);

	const classes = [
		{
			type: "big",
			cost: 350,
			format: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE]
		},
		{
			type: "basic",
			cost: 200,
			format: [WORK, CARRY, MOVE]
		}
	];
	
	classes.some(c => {
		if(c.cost <= currentEnergy){
			let newName = `${utils.getRandomName()} - ${c.type} ${role}`;
			console.log('Spawning new Carrier: ' + newName);
			spawner.spawnCreep(c.format, newName, { memory: { role: role } });
			return true;
		}
	});
};

module.exports = roleCarrier;