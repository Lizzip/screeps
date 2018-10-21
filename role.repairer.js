const utils = require('utils');
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
		// 1) Container
		// 2) Rampart < 25k
		// 3) Wall < 3000
		// 4) Road < 3000
		// 5) Wall < 5000
		// 6) Rampart
		// 7) Road
		// 8) Wall
		
		const containers = roleRepairer.getContainersForRepair(creep);
		let target = containers.length ? containers[0] : null;
		let maxHitpoints = 3000;
		
		if(!target){
			const ramparts = roleRepairer.getRampartsForRepair(creep, 25000);
			target = ramparts.length ? ramparts[0] : null;
		}
		
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
			const ramparts = roleRepairer.getRampartsForRepair(creep);
			target = ramparts.length ? ramparts[0] : null;
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
	}	
};

roleRepairer.getContainersForRepair = creep => {
	const filter = s => (s.structureType == STRUCTURE_CONTAINER && s.hits < s.hitsMax);
	return creep.room.find(FIND_STRUCTURES, {filter: filter});
};

roleRepairer.getRampartsForRepair = (creep, maxHit) => {
	let filter = null;
	
	if(maxHit){
		filter = s => (s.structureType == STRUCTURE_RAMPART && s.hits < maxHit);
	}
	else {
		filter = s => (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax);
	}
	
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
	const role = 'repairer';
	const currentEnergy = utils.currentAvailableBuildEnergy(spawner);
	
	const classes = [
		{
			type: "big",
			cost: 400,
			format: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
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
			console.log('Spawning new Repairer: ' + newName);
			spawner.spawnCreep(c.format, newName, { memory: { role: role } });
			return true;
		}
	});
};

module.exports = roleRepairer;