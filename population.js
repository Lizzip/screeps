const utils = require('utils');

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleRepairer = require('role.repairer');
const roleBrute = require('role.brute');

const population = {
    all: {
        brute: { t: 1, e: 0, r: roleBrute },
        harvester: { t: 1, e: 0, r: roleHarvester },
        distHarvester: { t: 1, e: 0, r: roleHarvester },
        carrier: { t: 1, e: 0, r: roleCarrier },
        upgrader: { t: 1, e: 0, r: roleUpgrader },
        miner: { t: 1, e: 0, r: roleMiner },
        builder: { t: 1, e: 0, r: roleBuilder },
        repairer: { t: 1, e: 0, r: roleRepairer }
    }
};

population.updateTargetPopulation = () => {
    const controllerLevel = utils.getControllerLevel();

    population.all.harvester.t = (controllerLevel < 2) ? 2 : 0;
    population.all.distHarvester.t = (controllerLevel < 2) ? 2 : 1;
    population.all.upgrader.t = 3;
    population.all.builder.t = utils.numConstructionSites() ? 2 : 0;
    population.all.carrier.t = 3;
    population.all.repairer.t = 2;
    population.all.miner.t = utils.nonFullContainerCount();
    population.all.brute.t = utils.hostileCount();
};

population.outputPopulations = () => {
    let targetPop = "Target Population:  ";
    let currentPop = "Current Population: ";
    const keys = Object.keys(population.all);

    keys.forEach(k => {
        targetPop += `${k}:${population.all[k].t}, `;
        currentPop += `${k}:${population.all[k].e}, `;
    });

    console.log(targetPop);
    console.log(currentPop);
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

    if (Game.time % 10 == 1) {
        console.log("Spawn", role, "next");
    }

    population.all[role].r.spawn(spawner, role);
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