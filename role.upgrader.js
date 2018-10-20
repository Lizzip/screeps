var roleUpgrader = {

    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
			const notEmptyContainerFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] > 0);
			const containers = creep.room.find(FIND_STRUCTURES, {filter: notEmptyContainerFilter});
			
			if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffffff' } });
			}
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

roleUpgrader.spawn = (spawner, time) => {
	let newName = 'Upgrader' + time;
	console.log('Spawning new Beyonce: ' + newName);
	spawner.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'upgrader' } });
};

module.exports = roleUpgrader;