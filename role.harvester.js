const utils = require('utils');

const roleHarvester = {};

roleHarvester.run = (creep, distance) => {
    const focus = distance ? 1 : 0;

    if (!creep.memory.harvesting && creep.carry.energy == 0) {
        creep.memory.harvesting = true;
        creep.say('🔄 harvest');
    }

    if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
        creep.memory.harvesting = false;
    }

    if (creep.memory.harvesting) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[focus]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[focus], { visualizePathStyle: { stroke: '#FFE56D' } });
        }
    } else {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (targets.length > 0) {

            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
            }
        } else {
            //If we can't provide for anything then be an upgrader
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

roleHarvester.spawn = (spawner, role) => {
    role = role || 'harvester';

    let newName = `${role}: ${utils.getRandomName()}`;
    if (spawner.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: role } }) == OK) {
        console.log('Spawning new Wurzels: ' + newName);
    }
};

module.exports = roleHarvester;