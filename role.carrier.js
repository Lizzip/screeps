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
			const notFullContainerFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] < s.storeCapacity);
			const containers = creep.room.find(FIND_STRUCTURES, {filter: notFullContainerFilter});
			
			if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffffff' } });
			}
		}
	}
	else {
		var targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN ||
					structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
			}
		});
		
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
	let newName = "Carrier" + Game.time;
	console.log('Spawning new Carrier: ' + newName);
	spawner.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'carrier' } });
};

module.exports = roleCarrier;