const roleMiner = {};

roleMiner.run = creep => {
	//const containerFilter = s => {return (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity)}
	//const containers = creep.room.find(FIND_MY_STRUCTURES, {filter: containerFilter});
	
	var containers = creep.room.find(FIND_STRUCTURES, {
		filter: structure => {
			return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
		}
	});
	
	
	if(containers.length){
		if(creep.pos.getRangeTo(containers[0]) == 0){
			const source = creep.pos.findClosestByPath(FIND_SOURCES);
			creep.harvest(source);
		}
		else {
			creep.moveTo(containers[0]);
		}
	}
};

roleMiner.spawn = (spawner, time) => {
	let newName = 'Miner' + time;
	console.log('Spawning new Miner: ' + newName);
	spawner.spawnCreep([WORK, WORK, MOVE], newName, { memory: { role: 'miner' } });
};

module.exports = roleMiner;