const utils = require('utils');
const AI = require('creepAI');

const roleBuilder = {
    classes: [{
            type: "bigger",
            format: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        },
        {
            type: "big",
            format: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        },
        {
            type: "basic",
            format: [WORK, CARRY, MOVE]
        }
    ]
};

roleBuilder.run = (creep, role) => {
    const spawnedBy = creep.memory.spawnedBy;
    let spawnedInThisRoom = false;
    if (utils.getSpawnersInRoom(creep.room).length && utils.getSpawnersInRoom(creep.room)[0].name == spawnedBy) spawnedInThisRoom = true;
    const targetRoom = creep.memory.targetRoom;

    if (targetRoom && spawnedInThisRoom) {
        //Head to next room
        AI.moveTowardsTargetRoom(creep, targetRoom);
    } else {
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            if (utils.inPanicMode()) {
                creep.say("PANICKING!");
                AI.provideEnergyToStructure(creep);
            } else {
                const target = roleBuilder.chooseBuildingTarget(creep);
                if (target) {
                    roleBuilder.build(creep, target);
                } else if (Game.flags.Flag1) {
                    creep.moveTo(Game.flags.Flag1.pos);
                }
            }
        } else {
            AI.locateEnergySource(creep);
        }
    }
};

roleBuilder.chooseBuildingTarget = creep => {
    //Priority order:
    // 1) Partially built structures 
    // 2) Spawn
    // 3) Containers
    // 4) Other non-road structures
    // 5) New build roads

    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    const partiallyBuiltStructures = _.filter(targets, target => target.progress > 0);
    const spawns = _.filter(targets, target => target.structureType == 'spawn');
    const containers = _.filter(targets, target => target.structureType == 'container');
    const nonRoads = _.filter(targets, target => target.structureType != 'road');
    let target = null;

    if (partiallyBuiltStructures.length) {
        target = partiallyBuiltStructures[0];
    } else if (spawns.length) {
        target = creep.pos.findClosestByPath(spawns);
    } else if (containers.length) {
        target = creep.pos.findClosestByPath(containers);
    } else if (nonRoads.length) {
        target = creep.pos.findClosestByPath(nonRoads);
    } else if (targets[0]) {
        target = creep.pos.findClosestByPath(targets);
    }

    return target
};

roleBuilder.build = (creep, target) => {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#0000FF' } });
    }
};

module.exports = roleBuilder;