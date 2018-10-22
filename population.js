const utils = require('utils');

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleRepairer = require('role.repairer');
const roleBrute = require('role.brute');

const population = {
    target: {
        harvesters: 1,
        distHarvesters: 1,
        upgraders: 1,
        builders: 1,
        carriers: 1,
        repairers: 1,
        miners: 1,
        brutes: 1
    },
    existing: {
        harvesters: 0,
        distHarvesters: 0,
        upgraders: 0,
        builders: 0,
        carriers: 0,
        repairers: 0,
        miners: 0,
        brutes: 0
    }
};

population.updatePopulation = () => {
    const controllerLevel = utils.getControllerLevel();

    population.target.harvesters = (controllerLevel < 2) ? 2 : 0;
    population.target.distHarvesters = (controllerLevel < 2) ? 2 : 1;
    population.target.upgraders = 3;
    population.target.builders = utils.numConstructionSites() ? 3 : 0;
    population.target.carriers = 2;
    population.target.repairers = 3;
    population.target.miners = utils.nonFullContainerCount();
    population.target.brutes = utils.hostileCount();

    population.getPopulation();
    population.outputPopulation();
};

population.outputPopulation = () => {
    if (Game.time % 30 == 1) {
        console.log(`Ideal Population:   harvester:${population.target.harvesters}, distHarvester:${population.target.distHarvesters}, carrier:${population.target.carriers}, miner:${population.target.miners}, upgrader:${population.target.upgraders}, builder:${population.target.builders}, repairer:${population.target.repairers}, brute:${population.target.brutes}`);
        console.log(`Current Population: harvester:${population.existing.harvesters}, distHarvester:${population.existing.distHarvesters}, carrier:${population.existing.carriers}, miner:${population.existing.miners}, upgrader:${population.existing.upgraders}, builder:${population.existing.builders}, repairer:${population.existing.repairers}, brute:${population.existing.brutes}`);
    }
};

population.getPopulation = () => {
    population.existing.harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester').length;
    population.existing.distHarvesters = _.filter(Game.creeps, creep => creep.memory.role == 'distHarvester').length;
    population.existing.upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader').length;
    population.existing.builders = _.filter(Game.creeps, creep => creep.memory.role == 'builder').length;
    population.existing.miners = _.filter(Game.creeps, creep => creep.memory.role == 'miner').length;
    population.existing.carriers = _.filter(Game.creeps, creep => creep.memory.role == 'carrier').length;
    population.existing.repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer').length;
    population.existing.brutes = _.filter(Game.creeps, creep => creep.memory.role == 'brute').length;
};

population.managePopulation = () => {
    let spawnNext = null;
    const t = population.target;
    const e = population.existing;

    if (e.brutes < t.brutes) spawnNext = 'brute';
    if (!spawnNext && e.harvesters < t.harvesters) spawnNext = 'harvester';
    if (!spawnNext && e.distHarvesters < t.distHarvesters) spawnNext = 'distHarvester';
    if (!spawnNext && e.carriers < t.carriers) spawnNext = 'carrier';
    if (!spawnNext && e.upgraders < t.upgraders) spawnNext = 'upgrader';
    if (!spawnNext && e.miners < t.miners) spawnNext = 'miner';
    if (!spawnNext && e.builders < t.builders) spawnNext = 'builder';
    if (!spawnNext && e.repairers < t.repairers) spawnNext = 'repairer';

    if (spawnNext) {
        population.spawn(spawnNext);
    }
};

population.spawn = role => {
    const spawnName = utils.getSpawnName();
    const spawner = Game.spawns[spawnName];

    if (Game.time % 3 == 1) {
        console.log("Spawn", role, "next");
    }

    switch (role) {
        case 'harvester':
            roleHarvester.spawn(spawner);
            break;
        case 'distHarvester':
            roleHarvester.spawn(spawner);
            break;
        case 'upgrader':
            roleUpgrader.spawn(spawner);
            break;
        case 'builder':
            roleBuilder.spawn(spawner);
            break;
        case 'miner':
            roleMiner.spawn(spawner);
            break;
        case 'carrier':
            roleCarrier.spawn(spawner);
            break;
        case 'repairer':
            roleRepairer.spawn(spawner);
            break;
        case 'brute':
            roleBrute.spawn(spawner);
            break;
        default:
            break;
    }
};

population.clearExpiredCreeps = () => {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('RIP:', name);
        }
    }
};

module.exports = population;