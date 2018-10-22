const utils = require('utils');
const AI = require('creepAI');

const roleBuilder = {
    classes: [{
            type: "big",
            cost: 400,
            format: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        },
        {
            type: "basic",
            cost: 200,
            format: [WORK, CARRY, MOVE]
        }
    ]
};

roleBuilder.run = creep => {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('🚧 build');
    }

    if (creep.memory.building) {
        //Priority order:
        // 1) Partially built structures 
        // 2) Containers
        // 2) Other non-road structures
        // 3) New build roads

        if (utils.inPanicMode()) {
            creep.say("PANICKING!");
            AI.provideEnergyToStructure(creep);
        } else {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            const partiallyBuiltStructures = _.filter(targets, target => target.progress > 0);
            const containers = _.filter(targets, target => target.structureType == 'container');
            const nonRoads = _.filter(targets, target => target.structureType != 'road');

            if (partiallyBuiltStructures.length) {
                roleBuilder.build(creep, partiallyBuiltStructures[0]);
            } else if (containers.length) {
                roleBuilder.build(creep, containers[0]);
            } else if (nonRoads.length) {
                roleBuilder.build(creep, nonRoads[0]);
            } else if (targets[0]) {
                roleBuilder.build(creep, targets[0]);
            } else if (Game.flags.Flag1) {
                creep.moveTo(Game.flags.Flag1.pos);
            }
        }
    } else {
        AI.locateEnergySource(creep);
    }
};

roleBuilder.build = (creep, target) => {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#0000FF' } });
    }
};

roleBuilder.spawn = spawner => {
    const role = 'builder';
    const currentEnergy = utils.currentAvailableBuildEnergy(spawner);

    roleBuilder.classes.some(c => {
        if (c.cost <= currentEnergy) {
            let newName = `${c.type} ${role}: ${utils.getRandomName()}`;
            if (spawner.spawnCreep(c.format, newName, { memory: { role: role } }) == OK) {
                console.log('Spawning new 5H: ' + newName);
            }
            return true;
        }
    });
};

module.exports = roleBuilder;