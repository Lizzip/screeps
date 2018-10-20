const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleRepairer = require('role.repairer');

const spawnName = 'Spawnzilla_1';

const maxHarvesters = 0;
const maxDistanceHarvesters = 0;
const maxUpgraders = 0;
const maxBuilders = 0;
const maxMiners = 2;
const maxCarriers = 4;
const maxRepairers = 2;

const clear = () => {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('RIP:', name);
        }
    }
}

const managePopulation = () => {
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester');
    const distanceHarvesters = _.filter(Game.creeps, creep => creep.memory.role == 'distHarvester');
    const upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader');
    const builders = _.filter(Game.creeps, creep => creep.memory.role == 'builder');
	const miners = _.filter(Game.creeps, creep => creep.memory.role == 'miner');
	const carriers = _.filter(Game.creeps, creep => creep.memory.role == 'carrier');
	const repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer');

    if (harvesters.length < maxHarvesters) roleHarvester.spawn(Game.spawns[spawnName], Game.time);
    if (upgraders.length < maxUpgraders) roleUpgrader.spawn(Game.spawns[spawnName], Game.time);
    if (builders.length < maxBuilders) roleBuilder.spawn(Game.spawns[spawnName], Game.time);
    if (distanceHarvesters.length < maxDistanceHarvesters) roleHarvester.spawn(Game.spawns[spawnName], Game.time, true);
	if (miners.length < maxMiners) roleMiner.spawn(Game.spawns[spawnName], Game.time);
	if (carriers.length < maxCarriers) roleCarrier.spawn(Game.spawns[spawnName], Game.time);
	if (repairers.length < maxRepairers) roleRepairer.spawn(Game.spawns[spawnName], Game.time);
}

module.exports.loop = function() {
    clear();

    managePopulation();

    if (Game.spawns[spawnName].spawning) {
        let spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
        Game.spawns[spawnName].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[spawnName].pos.x + 1,
            Game.spawns[spawnName].pos.y, { align: 'left', opacity: 0.8 });
    }

    for (var name in Game.creeps) {
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
            default:
                break;
        }
    }
}