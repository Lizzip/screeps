const utils = require('utils');
const AI = require('creepAI');

const roleRepairer = {
    classes: [{
            type: "big",
            format: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
        },
        {
            type: "basic",
            format: [WORK, CARRY, MOVE]
        }
    ]
};

roleRepairer.getNextTarget = creep => {
    let maxHitpoints = 3000;
    const increment = 2000;
    const maxTotal = 25000;
    const rampartMultiplier = 3;
    const wallMultiplier = 1.15;

    while (maxHitpoints < maxTotal) {
        const ramparts = roleRepairer.getRampartsForRepair(creep, maxHitpoints * rampartMultiplier);
        if (ramparts.length) return ramparts[0];

        const walls = roleRepairer.getWallsForRepair(creep, maxHitpoints * wallMultiplier);
        if (walls.length) return walls[0];

        const roads = roleRepairer.getRoadsForRepair(creep, maxHitpoints);
        if (roads.length) return roads[0];

        maxHitpoints += increment;
    }

    const ramparts = roleRepairer.getRampartsForRepair(creep);
    if (ramparts.length) return ramparts[0];

    const walls = roleRepairer.getWallsForRepair(creep);
    if (walls.length) return walls[0];

    const roads = roleRepairer.getRoadsForRepair(creep);
    if (roads.length) return roads[0];
};

roleRepairer.run = creep => {
    if (creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
    }

    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
        creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
        //Priority order:
        // 1) Container
        // In incremented iterations:
        //   2) Rampart
        //   3) Road
        //   4) Wall

        if (utils.inPanicMode()) {
            creep.say("PANICKING!");
            AI.provideEnergyToStructure(creep);
        } else {
            const containers = roleRepairer.getContainersForRepair(creep);
            let target = containers.length ? containers[0] : null;

            if (!target) target = roleRepairer.getNextTarget(creep);

            if (target) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
                }
            }
        }
    } else {
        AI.locateEnergySource(creep);
    }
};

roleRepairer.getContainersForRepair = creep => {
    const filter = s => (s.structureType == STRUCTURE_CONTAINER && s.hits < s.hitsMax);
    return creep.room.find(FIND_STRUCTURES, { filter: filter });
};

roleRepairer.getRampartsForRepair = (creep, maxHit) => {
    let filter = null;

    if (maxHit) {
        filter = s => (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax && s.hits < maxHit);
    } else {
        filter = s => (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax);
    }

    return creep.room.find(FIND_STRUCTURES, { filter: filter });
};

roleRepairer.getWallsForRepair = (creep, maxHit) => {
    let filter = null;

    if (maxHit) {
        filter = s => (s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax && s.hits < maxHit);
    } else {
        filter = s => (s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax);
    }

    return creep.room.find(FIND_STRUCTURES, { filter: filter });
};

roleRepairer.getRoadsForRepair = (creep, maxHit) => {
    let filter = null;

    if (maxHit) {
        filter = s => (s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax && s.hits < maxHit);
    } else {
        filter = s => (s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax);
    }

    return creep.room.find(FIND_STRUCTURES, { filter: filter });
};

roleRepairer.spawn = spawner => {
    const role = 'repairer';
    const currentEnergy = utils.currentAvailableBuildEnergy(spawner);

    roleRepairer.classes.some(c => {
		const cost = utils.calculateSpawnCost(c.format);
		
        if (cost <= currentEnergy) {
            let newName = `${c.type} ${role}: ${utils.getRandomName()}`;

            if (spawner.spawnCreep(c.format, newName, { memory: { role: role } }) == OK) {
                console.log('Spawning new Repairer: ' + newName);
            }
            return true;
        }
    });
};

module.exports = roleRepairer;