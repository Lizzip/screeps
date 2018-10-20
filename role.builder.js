const roleBuilder = {

    run: creep => {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
			//Priority order:
			// 1) partially built structures 
			// 2) Non-road structures
			// 3) New build roads
			
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			const partiallyBuiltStructures = _.filter(targets, target => target.progress > 0);
			const nonRoads = _.filter(targets, target => target.structureType != 'road');

			if(partiallyBuiltStructures.length){
				roleBuilder.build(creep, partiallyBuiltStructures[0]);
			}
			else if(nonRoads.length){
				roleBuilder.build(creep, nonRoads[0]);
			}
			else {
				roleBuilder.build(creep, targets[0]);
			}
        }
        else {
            const sources = creep.room.find(FIND_SOURCES);
			
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#FFE56D'}});
            }
        }
    },
	
	build: (creep, target) => {
		if(creep.build(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {visualizePathStyle: {stroke: '#0000FF'}});
		}
	}
};

module.exports = roleBuilder;
