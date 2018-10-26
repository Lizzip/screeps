const utils = require('utils');
const turrets = require('turrets');
const pop = require('population');
const structures = require('structures');

const roomName = utils.getRoomName();
const spawnName = utils.getSpawnName();
const spawner = Game.spawns[spawnName];
const room = Game.rooms[roomName];

module.exports.loop = function() {
    //Population Control
    pop.clearExpiredCreeps();
    pop.runAllCreeps();
    pop.manageAllRooms();

    //Tower Control
	turrets.defendAllRooms();

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

    //Functions to run every 60 ticks
    if (Game.time % 60 == 1) {
        structures.buildMissingStructures();
    }
	
	//utils.spawnScoutBuilderForRoom("W2N7");
};