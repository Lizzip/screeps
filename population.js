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
        scoutBuilder: { t: 0, e: 0, r: roleBuilder },
        repairer: { t: 1, e: 0, r: roleRepairer },
        scout: { t: 0, e: 0, r: roleScout },
        scoutHarvester: { t: 0, e: 0, r: roleHarvester }
    }
};

population.updateTargetPopulationForRoom = room => {
    const controllerLevel = Game.rooms[room].controller.level;
    const creep = utils.getAnyCreepInRoom(room);
    const all = population.all;

    all.harvester.t = (controllerLevel < 2) ? 2 : 0;
    all.distHarvester.t = (controllerLevel < 2) ? 2 : 1;
    all.upgrader.t = Math.max(1, Math.min(Math.floor(controllerLevel/2), 3));
    all.builder.t = utils.numConstructionSites(creep) ? Math.min(2, utils.numConstructionSites(creep) + 1) : 0;
    all.carrier.t = 2 + (Math.max(0, 2 - population.all.builder.t));
    all.repairer.t = Math.min(Math.floor(controllerLevel / 2), 2);
    all.miner.t = utils.nonFullContainerCount(creep);
    all.brute.t = utils.anyWallsFallen(creep) ? utils.hostileCount(room) : 0;

	//all.scoutHarvester.t = 1;
	//all.scoutBuilder.t = 3;
};

population.outputPopulationForRoom = room => {
	let p = `Population ${room}:  `;

    Object.keys(population.all).forEach(k => {
        p += `${k}:${population.all[k].e}/${population.all[k].t}, `;
    });

    console.log(p.substring(0, p.length - 2));
}

population.outputPopulations = () => {
    let p = "Population:  ";

    Object.keys(population.all).forEach(k => {
        p += `${k}:${population.all[k].e}/${population.all[k].t}, `;
    });

    console.log(p.substring(0, p.length - 2));
};

population.getExistingPopulationForRoom = room => {
    const keys = Object.keys(population.all);

    keys.forEach(k => {
        population.all[k].e = utils.getNumCreepsInRoomWithRole(room, k);
    });
};

population.managePopulationForRoom = room => {
    let spawnNext = null;
    const keys = Object.keys(population.all);

    keys.some(k => {
        if (population.all[k].e < population.all[k].t) {
            spawnNext = k;
            return true;
        }
    });

    if (spawnNext) {
        population.spawn(spawnNext, room);
    }
};

population.spawn = (role, roomName) => {
	const spawners = Game.rooms[roomName].find(FIND_MY_SPAWNS); 

	if(spawners.length){
		const spawner = spawners[0];
		const spawnName = spawner.name;
		const currentEnergy = utils.currentAvailableBuildEnergy(spawner);
		const classes = population.all[role].r.classes;

		if (Game.time % 10 == 1) {
			console.log("Spawn", role, "next");
		}

		const mem = { role: role, spawnedBy: spawnName, spawnRoom: spawner.room.name };

		if (role.includes('scout') && utils.unclaimedRoomsList().length) {
			mem.targetRoom = utils.unclaimedRoomsList()[0];
		}

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
	}
};

population.runAllCreeps = () => {
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

population.manageAllRooms = () => {
    const rooms = Object.keys(utils.getRoomNamesList());
    const p = population;

    //if (false == true) {
        rooms.forEach(room => {
            p.updateTargetPopulationForRoom(room);
            p.getExistingPopulationForRoom(room);
            p.managePopulationForRoom(room);
			
			if (Game.time % 60 == 1) {
				p.outputPopulationForRoom(room);
			}
        });
    //}
/*
    p.updateTargetPopulationForRoom("W1N7");
    p.getExistingPopulationForRoom("W1N7");
    p.managePopulationForRoom("W1N7");
	if (Game.time % 60 == 1) {
		p.outputPopulationForRoom("W1N7");
	}*/
};

module.exports = population;