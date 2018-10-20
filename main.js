const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

const spawnName = 'Spawnzilla_1';

const maxHarvesters = 1;
const maxDistanceHarvesters = 4;
const maxUpgraders = 2;
const maxBuilders = 3;

const clear = () => {
	for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('RIP:', name);
        }
    }
}

const managePopulation = () => {
	const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    const distanceHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'distHarvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    
    if(harvesters.length < maxHarvesters) {
        let newName = 'Harvester' + Game.time;
        console.log('Spawning new Wurzels: ' + newName);
        Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }
    
    if(upgraders.length < maxUpgraders){
        let newName = 'Upgrader' + Game.time;
        console.log('Spawning new Beyonce: ' + newName);
        Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }
    
    if(builders.length < maxBuilders){
        let newName = 'Builder' + Game.time;
        console.log('Spawning new 5H: ' + newName);
        Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'builder'}});
    }
	
	if(distanceHarvesters.length < maxDistanceHarvesters){
        let newName = 'DistHarvester' + Game.time;
        console.log('Spawning new Distance Wurzels: ' + newName);
        Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'distHarvester'}});
    }
}

module.exports.loop = function () {
    clear();
	
    managePopulation();
	
    if(Game.spawns[spawnName].spawning) {
        let spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
        Game.spawns[spawnName].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[spawnName].pos.x + 1,
            Game.spawns[spawnName].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        let creep = Game.creeps[name];
        
        switch(creep.memory.role){
            case 'harvester': roleHarvester.run(creep); break;
            case 'distHarvester': roleHarvester.run(creep, true); break;
            case 'upgrader': roleUpgrader.run(creep); break;
            case 'builder': roleBuilder.run(creep); break;
            default: break;
        }
    }
}