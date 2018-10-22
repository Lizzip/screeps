const utils = require('utils');
const turrets = require('turrets');
const pop = require('population');

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleRepairer = require('role.repairer');
const roleBrute = require('role.brute');

const roles = {
	brute: roleBrute,
	harvester: roleHarvester,
	distHarvester: roleHarvester,
	carrier: roleCarrier,
	upgrader: roleUpgrader,
	miner: roleMiner,
	builder: roleBuilder,
	repairer: roleRepairer
};

const roomName = utils.getRoomName();
const spawnName = utils.getSpawnName();
const spawner = Game.spawns[spawnName];
const room = Game.rooms[roomName];

module.exports.loop = function() {
    //Population Control
    pop.clearExpiredCreeps();
    pop.updateTargetPopulation();
    pop.getExistingPopulation();
    pop.managePopulation();

    if (Game.time % 60 == 1) {
        pop.outputPopulations();
    }

    //Creep Control
    for (const name in Game.creeps) {
        let creep = Game.creeps[name];
		const isDistHarvester = (creep.memory.role == 'distHarvester') ? true : null;
		roles[creep.memory.role].run(creep, isDistHarvester);
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