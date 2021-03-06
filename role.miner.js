const utils = require('utils');

const roleMiner = {
    classes: [
		{
			type: "bigger",
			format: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
		},
		{
            type: "big",
            format: [WORK, WORK, WORK, WORK, MOVE]
        },
        {
            type: "basic",
            format: [WORK, WORK, MOVE]
        }
    ]
};

roleMiner.run = creep => {
    const notFullContainerFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] < s.storeCapacity);
    const containers = creep.room.find(FIND_STRUCTURES, { filter: notFullContainerFilter });

    //Remove all containers already claimed by another miner from list
    if (containers.length) {
        const allMinerPos = roleMiner.getPosOfAllOtherMiners(creep);

        allMinerPos.forEach(miner => {
            let i = containers.length;
            while (i--) {
                if (miner.getRangeTo(containers[i]) == 0) {
                    containers.splice(i, 1);
                }
            }
        });
    }

    //If there's still a free container, go claim it
    if (containers.length) {
        if (creep.pos.getRangeTo(containers[0]) == 0) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            creep.harvest(source);
        } else {
            creep.moveTo(containers[0]);
        }
    }
};

roleMiner.getPosOfAllOtherMiners = me => {
    const miners = [];
    for (let i in Game.creeps) {
        if (Game.creeps[i].memory.role == 'miner' && Game.creeps[i].name !== me.name) {
            miners.push(Game.creeps[i].pos);
        }
    }
    return miners;
};

module.exports = roleMiner;