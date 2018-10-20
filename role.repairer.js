const roleRepairer = {};

roleRepairer.run = creep => {
	if (creep.memory.repairing && creep.carry.energy == 0) {
		creep.memory.repairing = false;
	}
	
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
		creep.memory.repairing = true;
    }
	
	if(creep.memory.repairing){
		//Priority order:
		// 1) Rampart
		// 2) Wall < 3000
		// 3) Road < 3000
		// 4) Wall < 5000
		// 5) Road
		// 6) Wall
		
		const ramparts = roleRepairer.getRampartsForRepair(creep);
		let target = ramparts.length ? ramparts[0] : null;
		let maxHitpoints = 3000;
		
		if(!target){
			const walls = roleRepairer.getWallsForRepair(creep, maxHitpoints);
			target = walls.length ? walls[0] : null;
		}
		
		if(!target){
			const roads = roleRepairer.getRoadsForRepair(creep, maxHitpoints);
			target = roads.length ? roads[0] : null;
		}
		
		maxHitpoints = 5000;
		
		if(!target){
			const walls = roleRepairer.getWallsForRepair(creep, maxHitpoints);
			target = walls.length ? walls[0] : null;
		}
		
		if(!target){
			const roads = roleRepairer.getRoadsForRepair(creep);
			target = roads.length ? roads[0] : null;
		}
		
		if(!target){
			const walls = roleRepairer.getWallsForRepair(creep);
			target = walls.length ? walls[0] : null;
		}
		
		if (creep.repair(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target,{ visualizePathStyle: { stroke: '#00ff00' } });
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

roleRepairer.getRampartsForRepair = creep => {
	const filter = s => (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax);
	return creep.room.find(FIND_STRUCTURES, {filter: filter});
};

roleRepairer.getWallsForRepair = (creep, maxHit) => {
	let filter = null;
	
	if(maxHit){
		filter = s => (s.structureType == STRUCTURE_WALL && s.hits < maxHit);
	}
	else {
		filter = s => (s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax);
	}
	
	return creep.room.find(FIND_STRUCTURES, {filter: filter});
};

roleRepairer.getRoadsForRepair = (creep, maxHit) => {
	let filter = null;
	
	if(maxHit){
		filter = s => (s.structureType == STRUCTURE_ROAD && s.hits < maxHit);
	}
	else {
		filter = s => (s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax);
	}
	
	return creep.room.find(FIND_STRUCTURES, {filter: filter});
};

roleRepairer.spawn = spawner => {
	let newName = "Repair" + Game.time;
	console.log('Spawning new Repairer: ' + newName);
	spawner.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'repairer' } });
};

module.exports = roleRepairer;