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

roleHarvester.run = (creep, distance) => {
    const focus = distance ? 1 : 0;

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
            //If we can't provide for anything then be an upgrader
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleHarvester;