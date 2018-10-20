const roleRepairer = {};

roleRepairer.run = creep => {
	if (creep.memory.repairing && creep.carry.energy == 0) {
		creep.memory.repairing = false;
	}
	
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
		creep.memory.repairing = true;
    }
	
	if(creep.memory.repairing){
		const requiresRepairFilter = s => ((s.structureType === STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_ROAD) && s.hits < 3000);
		const requiresRepairs = creep.room.find(FIND_STRUCTURES, {filter: requiresRepairFilter});
		
		if (creep.repair(requiresRepairs[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(requiresRepairs[0],{ visualizePathStyle: { stroke: '#00ff00' } });
		}
	}
	else {
		const notEmptyContainerFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] > 0);
		const containers = creep.room.find(FIND_STRUCTURES, {filter: notEmptyContainerFilter});
		
		if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffffff' } });
		}
	}	
};

roleRepairer.spawn = spawner => {
	let newName = "Repair" + Game.time;
	console.log('Spawning new Repairer: ' + newName);
	spawner.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'repairer' } });
};

module.exports = roleRepairer;