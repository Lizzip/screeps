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

roleCarrier.spawn = spawner => {
    const role = 'carrier';
    const currentEnergy = utils.currentAvailableBuildEnergy(spawner);

    roleCarrier.classes.some(c => {
		const cost = utils.calculateSpawnCost(c.format);
		
        if (cost <= currentEnergy) {
            let newName = `${c.type} ${role}: ${utils.getRandomName()}`;

            if (spawner.spawnCreep(c.format, newName, { memory: { role: role } }) == OK) {
                console.log('Spawning new Carrier: ' + newName);
            }
            return true;
        }
    });
};

module.exports = roleCarrier;