const utils = require('utils');
const AI = require('creepAI');

const roleHarvester = {
	classes: [
        {
            type: "basic",
            format: [WORK, CARRY, MOVE]
        }
    ]
};

roleHarvester.run = (creep, role) => {
    const focus = (role == 'distHarvester') ? 1 : 0;
	const traveller = (role == 'scoutHarvester') ? true : false;
	const spawnedBy = creep.memory.spawnedBy;
	const spawnedInThisRoom = (creep.room.name == spawnedBy);
	const targetRoom = creep.memory.targetRoom;
	
	if(traveller && spawnedInThisRoom && targetRoom){
		//Head to next room
		const route = Game.map.findRoute(creep.room, targetRoom);
		if(route.length > 0) {
			const exit = creep.pos.findClosestByRange(route[0].exit);
			creep.moveTo(exit);
		}
	}
	else {
		if (!creep.memory.harvesting && creep.carry.energy == 0) {
			creep.memory.harvesting = true;
			creep.say('🔄 harvest');
		}

		if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
			creep.memory.harvesting = false;
			creep.say("offload");
		}

		if (creep.memory.harvesting) {
			const sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[focus]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[focus], { visualizePathStyle: { stroke: '#FFE56D' } });
			}
		} else {
			if (!AI.provideEnergyToStructure(creep)) {
				//If we can't provide for anything then be an upgrader if we're a harvester, or add resource to storage if we're a distHarvester
				//If head count is lower than 3 there might not be any upgraders
				if(creep.memory.role == 'distHarvester' && creep.room.storage && utils.getHeadCount() > 3){
					if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#00ff00' } });
					}
				}
				else {
					if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller);
					}
				}
				
			}
		}
	}
};

module.exports = roleHarvester;