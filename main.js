const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleRepairer = require('role.repairer');
const roleBrute = require('role.brute');

const utils = require('utils');
const turrets = require('turrets');
const pop = require('population');

const roomName = utils.getRoomName();
const spawnName = utils.getSpawnName();
const spawner = Game.spawns[spawnName];
const room = Game.rooms[roomName];

module.exports.loop = function() {
    //Population Control
    pop.clearExpiredCreeps();
    pop.updatePopulation();
    pop.managePopulation();

    //Creep Control
    for (const name in Game.creeps) {
        let creep = Game.creeps[name];

        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'distHarvester':
                roleHarvester.run(creep, true);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'miner':
                roleMiner.run(creep);
                break;
            case 'carrier':
                roleCarrier.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'brute':
                roleBrute.run(creep);
                break;
            default:
                break;
        }
    }

    //Tower Control
    turrets.buildIfIsDown(room);
    turrets.defendRoom(room);

    //Spawner Control 
    if (spawner.spawning) {
        let spawningCreep = Game.creeps[spawner.spawning.name];
        if (spawningCreep && spawningCreep.memory.role) {
            spawner.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawner.pos.x + 1,
                spawner.pos.y, { align: 'left', opacity: 0.8 });
        }
    }

}