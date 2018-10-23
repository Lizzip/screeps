const utils = require('utils');

const AI = {};

AI.locateEnergySource = creep => {	
    // Priority Order
    // 1) Dropped resource with more resource than the creep can carry
    // 2) Closest container with more resource than the creep can carry
    // 3) Any dropped resource
    // 4) Harvest source if creep has WORK part
    // 5) Closest container with fewer resources than the creep can carry
    // 6) No way of getting energy, go sit at Flag1 and wait for death

	creep.memory.providing = null;
    const maxCarry = creep.carryCapacity;
    let target = AI.getDroppedEnergy(creep, maxCarry);
	
    if (target) {
        //Dropped resource with more resource than creep can carry
        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return;
    }

    target = AI.getContainer(creep, maxCarry);

    if (target) {
        //Container with more resource than creep can carry
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return;
    }

    target = AI.getDroppedEnergy(creep, 1);

    if (target) {
        //Any dropped resource
        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return;
    }

    if (AI.hasWorkPart(creep)) {
        target = creep.room.find(FIND_SOURCES)[0];

        //Harvest source if creep has WORK part
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#FFE56D' } });
        }
        return;
    }

    target = AI.getContainer(creep, 1);

    if (target) {
        //Container with less resource than creep can carry
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return;
    }

    //No way of getting energy, go sit at Flag1 and wait for death
    if (Game.flags.Flag1) {
		creep.memory.target = "Flag";
        creep.moveTo(Game.flags.Flag1.pos);
    }
};

AI.getDroppedEnergy = (creep, requiredEnergy) => {
    const droppedEnergyFilter = d => (d.amount >= requiredEnergy && d.resourceType == RESOURCE_ENERGY);
    return creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: droppedEnergyFilter });
};

AI.getContainer = (creep, requiredEnergy, sort = false) => {
    const containersFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] >= requiredEnergy);
    const containers = creep.room.find(FIND_STRUCTURES, { filter: containersFilter });

    if (!containers.length) return null;
    return creep.pos.findClosestByPath(containers);
};

AI.hasWorkPart = creep => {
    const parts = creep.body;
    return parts.some(b => {
        return b.type == 'work';
    });
};

AI.getFirstUnclaimed = structures => {
	let target = null;
	
	if (structures.length){
		structures.some(t => {
			if(!utils.getCreepWithMemory('providing', t.id)){
				target = t;
				return true;
			}
		});
	}
	
	return target;
};

AI.getClosestUnclaimed = (structures, creep) => {
	let target = null;
	let targets = [];
	
	if (structures.length){
		structures.forEach(t => {
			if(!utils.getCreepWithMemory('providing', t.id)){
				targets.push(t);
			}
		});
		
		target = creep.pos.findClosestByPath(targets);
	}
	
	return target;
};


AI.provideEnergyToStructure = creep => {
	//TODO: Assign creep to structure
	
    // Priority Order
    // 1) Spawner
    // 2) Tower < 50%
    // 3) Extension
    // 4) Tower

    let filter = null;
    let targets = null;
    let target = null;
	let previousTarget = creep.memory.providing;
	
	//KEEP CURRENT FOCUS - If we have a target and it still needs attention, keep that focus
	if(previousTarget){
		filter = s => s.id == previousTarget;
		const prev = creep.room.find(FIND_STRUCTURES, { filter: filter });
		
		//If the target has full energy then unassign self
		if(prev.length && prev[0].energy < prev[0].energyCapacity){ 
			target = prev[0];
		}
	}
	
	//NEW FOCUS
	
    //Spawner (always overrides existing focus) 
	filter = s => s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity;
	targets = creep.room.find(FIND_STRUCTURES, { filter: filter });
	if (targets.length){
		target = creep.pos.findClosestByPath(targets);
	}

    //Tower < 50%
    if (!target) {
        filter = s => (s.structureType == STRUCTURE_TOWER && s.energy < (s.energyCapacity / 2));
        targets = creep.room.find(FIND_STRUCTURES, { filter: filter });
		target = AI.getClosestUnclaimed(targets, creep);
    }

    //Extension
    if (!target) {
        filter = s => (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity);
        targets = creep.room.find(FIND_STRUCTURES, { filter: filter });
		target = AI.getClosestUnclaimed(targets, creep);
    }

    //Tower
    if (!target) {
        filter = s => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity);
        targets = creep.room.find(FIND_STRUCTURES, { filter: filter });
        target = AI.getClosestUnclaimed(targets, creep);
    }

    if (target) {
		creep.memory.providing = target.id;
		creep.say(creep.memory.providing);
		
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
        }
        return true;
    } 
	else return false;
};


module.exports = AI;