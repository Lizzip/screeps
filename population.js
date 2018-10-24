const utils = require('utils');

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleRepairer = require('role.repairer');
const roleBrute = require('role.brute');
const roleScout = require('role.scout');

const population = {
    all: {
        brute: { t: 1, e: 0, r: roleBrute },
        harvester: { t: 1, e: 0, r: roleHarvester },
        distHarvester: { t: 1, e: 0, r: roleHarvester },
        carrier: { t: 1, e: 0, r: roleCarrier },
        upgrader: { t: 1, e: 0, r: roleUpgrader },
        miner: { t: 1, e: 0, r: roleMiner },
        builder: { t: 1, e: 0, r: roleBuilder },
        repairer: { t: 1, e: 0, r: roleRepairer },
		scout: { t: 0, e: 0, r: roleScout },
		scoutHarvester: { t: 0, e: 0, r: roleHarvester }
    }
};

population.updateTargetPopulation = () => {
    const controllerLevel = utils.getControllerLevel();

    population.all.harvester.t = (controllerLevel < 2) ? 2 : 0;
    population.all.distHarvester.t = (controllerLevel < 2) ? 2 : 1;
    population.all.upgrader.t = 3;
    population.all.builder.t = utils.numConstructionSites() ? /*Math.min(2, utils.numConstructionSites() + 1)*/ 1 : 0;
    population.all.carrier.t = 2 + (Math.max(0, 2 - population.all.builder.t));
    population.all.repairer.t = 2;
    population.all.miner.t = utils.nonFullContainerCount();
    population.all.brute.t = utils.anyWallsFallen() ? utils.hostileCount() : 0;
	
	if(utils.unclaimedRoomsList().length){
		population.all.scoutHarvester.t = 2;
	}
};

population.outputPopulations = () => {
    let p = "Population:  ";

    Object.keys(population.all).forEach(k => {
        p += `${k}:${population.all[k].e}/${population.all[k].t}, `;
	});
	
    console.log(p.substring(0, p.length - 2));
};

population.getExistingPopulation = () => {
    const keys = Object.keys(population.all);

    keys.forEach(k => {
        population.all[k].e = _.filter(Game.creeps, creep => creep.memory.role == k).length;
    });
};

population.managePopulation = () => {
    let spawnNext = null;
    const keys = Object.keys(population.all);

    keys.some(k => {
        if (population.all[k].e < population.all[k].t) {
            spawnNext = k;
            return true;
        }
    });

    if (spawnNext) {
        population.spawn(spawnNext);
    }
};

population.spawn = role => {
    const spawnName = utils.getSpawnName();
    const spawner = Game.spawns[spawnName];
	const currentEnergy = utils.currentAvailableBuildEnergy(spawner);
	const script = population.all[role].r;
	const classes = script.classes;

	if (Game.time % 10 == 1) {
        console.log("Spawn", role, "next");
    }

	const mem = { role: role, spawnedBy: spawnName };
	
	if(role == 'scoutHarvester') mem.targetRoom = utils.unclaimedRoomsList()[0];
	
    classes.some(c => {
		const cost = utils.calculateSpawnCost(c.format);
		
        if (cost <= currentEnergy) {
            let newName = `${c.type} ${role}: ${utils.getRandomName()}`;

            if (spawner.spawnCreep(c.format, newName, { memory: mem }) == OK) {
                console.log('Spawning ' + newName);
            }
            return true;
        }
    });
};

population.run = () => {
	for (const name in Game.creeps) {
        let creep = Game.creeps[name];
		population.all[creep.memory.role].r.run(creep, creep.memory.role);
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