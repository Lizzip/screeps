const utils = require('utils');
const AI = {};

AI.locateEnergySource = creep => {
	// Priority Order
	// 1) Dropped resource with more resource than creep can carry
	// 2) Container with more resource than creep can carry
	// 3) Any dropped resource
	// 4) Harvest source if creep has WORK part
	// 5) Container with less resource than creep can carry
	// 6) No way of getting energy, go sit at Flag1 and wait for death
	
	const maxCarry = creep.carryCapacity;
	let target = AI.getDroppedEnergy(creep, maxCarry);
	
	if(target){
		//Dropped resource with more resource than creep can carry
		if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
		}
		return;
	}
	
	target = AI.getContainer(creep, maxCarry);
	
	if(target){
		//Container with more resource than creep can carry
		if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
		}
		return;
	}
	
	target = AI.getDroppedEnergy(creep, 1);
	
	if(target){
		//Any dropped resource
		if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
		}
		return;
	}
	
	if(AI.hasWorkPart(creep)){
		target = creep.room.find(FIND_SOURCES)[0];
		
		//Harvest source if creep has WORK part
		if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, { visualizePathStyle: { stroke: '#FFE56D' } });
		}
		return;
	}
	
	target = AI.getContainer(creep, 1, true);
	
	if(target){
		//Container with less resource than creep can carry
		if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
		}
		return;
	}
	
	//No way of getting energy, go sit at Flag1 and wait for death
	if(Game.flags.Flag1){
		creep.moveTo(Game.flags.Flag1.pos);
	}
};

AI.getDroppedEnergy = (creep, requiredEnergy) => {
	const droppedEnergyFilter = d => (d.amount >= requiredEnergy && d.resourceType == RESOURCE_ENERGY);
	return creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: droppedEnergyFilter});
};

AI.getContainer = (creep, requiredEnergy, sort = false) => { 
	const containersFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] >= requiredEnergy);
	const containers = creep.room.find(FIND_STRUCTURES, {filter: containersFilter});
	
	//Sort containers by stored amount
	if(sort && containers.length > 1){
		containers.sort((c1,c2) => c1.store[RESOURCE_ENERGY] < c2.store[RESOURCE_ENERGY]);
	}
	
	return containers.length ? containers[0] : null;
};

AI.hasWorkPart = creep => {
	const parts = creep.body;
	return parts.some(b => {
		return b.type == 'work';
	});
}


module.exports = AI;