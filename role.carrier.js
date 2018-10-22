const utils = require('utils');
const AI = require('creepAI');

const roleCarrier = {
    classes: [{
            type: "big",
            cost: 350,
            format: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE]
        },
        {
            type: "basic",
            cost: 200,
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
        /*
        const targetsFilter = s => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity;
        const targets = creep.room.find(FIND_STRUCTURES, {filter: targetsFilter});
		
        if (targets.length > 0) {
        	if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        		creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        	}
        } else {
        	//If we can't provide for anything then be an upgrader
        	if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        		creep.moveTo(creep.room.controller);
        	}
        }*/
    }
};

roleCarrier.spawn = spawner => {
    const role = 'carrier';
    const currentEnergy = utils.currentAvailableBuildEnergy(spawner);

    roleCarrier.classes.some(c => {
        if (c.cost <= currentEnergy) {
            let newName = `${c.type} ${role}: ${utils.getRandomName()}`;
            console.log('Spawning new Carrier: ' + newName);
            spawner.spawnCreep(c.format, newName, { memory: { role: role } });
            return true;
        }
    });
};

module.exports = roleCarrier;