const utils = require('utils');

const roleBrute = {
    classes: [/*{
            type: "horse",
            format: [TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, ATTACK]
        },
        {
            type: "archer",
            format: [MOVE, MOVE, ATTACK, RANGED_ATTACK]
        },*/
        {
			type: "biggerMelee",
			format: [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK]
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

module.exports = roleBrute;