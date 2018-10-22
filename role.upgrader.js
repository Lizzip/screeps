const utils = require('utils');
const AI = require('creepAI');

const roleUpgrader = {
    classes: [{
            type: "big",
            format: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        },
        {
            type: "basic",
            format: [WORK, CARRY, MOVE]
        }
    ]
};

roleUpgrader.run = creep => {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('🔄 harvest');
    }

    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
		creep.say("upgrade");
    }

    if (!creep.memory.upgrading) {
        AI.locateEnergySource(creep);
    } else {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
};

module.exports = roleUpgrader;