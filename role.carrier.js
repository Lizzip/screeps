const utils = require('utils');
const AI = require('creepAI');

const roleCarrier = {
    classes: [{
            type: "big",
            format: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE]
        },
        {
            type: "basic",
            format: [WORK, CARRY, MOVE]
        }
    ]
};

roleCarrier.run = creep => {
    if (!creep.memory.gathering && creep.carry.energy == 0) {
        creep.memory.gathering = true;
        creep.say('gather');
    }

    if (creep.memory.gathering && creep.carry.energy == creep.carryCapacity) {
        creep.memory.gathering = false;
        creep.say('offload');
    }

    if (creep.memory.gathering) {
        AI.locateEnergySource(creep);
    } else {
        if (!AI.provideEnergyToStructure(creep)) {
            //If we can't provide for anything then be an upgrader
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleCarrier;