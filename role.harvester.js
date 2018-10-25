const utils = require('utils');
const AI = require('creepAI');

const roleHarvester = {
    classes: [{
        type: "basic",
        format: [WORK, CARRY, MOVE]
    }]
};

roleHarvester.run = (creep, role) => {
    const focus = (role == 'distHarvester') ? 1 : 0;
    const spawnedBy = creep.memory.spawnedBy;
    let spawnedInThisRoom = false;
    if (utils.getSpawnersInRoom(creep.room).length && utils.getSpawnersInRoom(creep.room)[0].name == spawnedBy) spawnedInThisRoom = true;
    const targetRoom = creep.memory.targetRoom;

    if (targetRoom && spawnedInThisRoom) {
        //Head to next room
        AI.moveTowardsTargetRoom(creep, targetRoom);
    } else {

        //If we're stuck on the edge, move in one
        if (targetRoom) {
            if (creep.pos.x == 49) {
                creep.move(LEFT);
            } else if (creep.pos.x == 0) {
                creep.move(RIGHT);
            } else if (creep.pos.y == 0) {
                creep.move(BOTTOM);
            } else if (creep.pos.y == 49) {
                creep.move(TOP);
            }
        }

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
            let source = null;

            if ('distHarvester') source = sources[focus];
            else source = creep.pos.findClosestByPath(sources);

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#FFE56D' } });
            }
        } else {
            if (!AI.provideEnergyToStructure(creep)) {
                //If we can't provide for anything then be an upgrader if we're a harvester, or add resource to storage if we're a distHarvester
                //If head count is lower than 3 there might not be any upgraders
                if (creep.memory.role == 'distHarvester' && creep.room.storage && utils.getHeadCount() > 3) {
                    if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#00ff00' } });
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }

            }
        }
    }
};

module.exports = roleHarvester;