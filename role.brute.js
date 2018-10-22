const utils = require('utils');

const roleBrute = {
    classes: [{
            type: "horse",
            format: [TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, ATTACK]
        },
        {
            type: "archer",
            format: [MOVE, MOVE, ATTACK, RANGED_ATTACK]
        },
        {
            type: "melee",
            format: [TOUGH, MOVE, MOVE, ATTACK]
        }
    ]
};

roleBrute.run = creep => {
    let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (target) {
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);

        if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
            }
        } else {
            creep.moveTo(Game.flags.Flag1.pos);
        }
    }
};

roleBrute.spawn = spawner => {
    const role = 'brute';
    const currentEnergy = utils.currentAvailableBuildEnergy(spawner);
    const wallsDown = utils.anyWallsFallen();

    roleBrute.classes.some(c => {
		const cost = utils.calculateSpawnCost(c.format);
		
        if (cost <= currentEnergy) {
            let newName = `${c.type} ${role}: ${utils.getRandomName()}`;

            //Only enable melee types for now
            if (c.type == 'horse') return false;
            if (c.type == 'archer' /* && wallsDown*/ ) return false;
            if (c.type == 'melee' && !wallsDown) return false;

            if (spawner.spawnCreep(c.format, newName, { memory: { role: role } }) == OK) {
                console.log('Spawning new Brutus: ' + newName);
            }
            return true;
        }
    });
};

module.exports = roleBrute;