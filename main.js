const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleRepairer = require('role.repairer');
const roleBrute = require('role.brute');
const utils = require('utils');
const turrets = require('turrets');

const roomName = utils.getRoomName();
const spawnName = utils.getSpawnName();
const spawner = Game.spawns[spawnName];
const room = Game.rooms[roomName];

const managePopulation = () => {
	const maxHarvesters = 0;
	const maxDistanceHarvesters = 2;
	const maxUpgraders = 1;
	const maxBuilders = utils.numConstructionSites() ? 1 : 0;
	const maxCarriers = 3;
	const maxRepairers = 3;
	const maxMiners = utils.nonFullContainerCount();
	const maxBrutes = hostileCount();
	
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester');
    const distanceHarvesters = _.filter(Game.creeps, creep => creep.memory.role == 'distHarvester');
    const upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader');
    const builders = _.filter(Game.creeps, creep => creep.memory.role == 'builder');
	const miners = _.filter(Game.creeps, creep => creep.memory.role == 'miner');
	const carriers = _.filter(Game.creeps, creep => creep.memory.role == 'carrier');
	const repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer');
	const brutes = _.filter(Game.creeps, creep => creep.memory.role == 'brute');

    if (harvesters.length < maxHarvesters) roleHarvester.spawn(spawner);
	if (distanceHarvesters.length < maxDistanceHarvesters) roleHarvester.spawn(spawner, true);
	if (carriers.length < maxCarriers) roleCarrier.spawn(spawner);
	if (miners.length < maxMiners) roleMiner.spawn(spawner);
	if (upgraders.length < maxUpgraders) roleUpgrader.spawn(spawner);
    if (builders.length < maxBuilders) roleBuilder.spawn(spawner);
	if (repairers.length < maxRepairers) roleRepairer.spawn(spawner);
	if (brutes.length < maxBrutes) roleBrute.spawn(spawner);
	
	if(Game.time % 30 == 1){
		console.log(`Population: harvester:${harvesters.length}, distHarvester:${distanceHarvesters.length}, carrier:${carriers.length}, miner:${miners.length}, upgrader:${upgraders.length}, builder:${builders.length}, repairer:${repairers.length}, brute:${brutes.length}`);
	}
}

const hostileCount = () => {
	return room.find(FIND_HOSTILE_CREEPS).length;
};

module.exports.loop = function() {	
	//Creep Control
    utils.clearExpiredCreeps();
    managePopulation();
	
	if (spawner.spawning) {
        let spawningCreep = Game.creeps[spawner.spawning.name];
		if(spawningCreep && spawningCreep.memory.role){
			spawner.room.visual.text(
				'🛠️' + spawningCreep.memory.role,
				spawner.pos.x + 1,
				spawner.pos.y, { align: 'left', opacity: 0.8 });
		}
    }

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
    
}