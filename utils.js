const utils = {};

utils.maxPossibleBuildEnergy = () => {
	const creep = utils.getAnyCreep();
	const spawnCapacity = 300;
	const extensionCapacity = 50;
	
	const filter = s => s.structureType == STRUCTURE_EXTENSION;
	const extensions = creep.room.find(FIND_STRUCTURES, {filter: filter});
	return spawnCapacity + (extensionCapacity * extensions.length);
};

utils.currentAvailableBuildEnergy = spawner => {
	const creep = utils.getAnyCreep();
	const filter = s => s.structureType == STRUCTURE_EXTENSION;
	const extensions = creep.room.find(FIND_STRUCTURES, {filter: filter});
	
	let totalEnergy = spawner.energy;
	extensions.forEach(e => { totalEnergy += e.energy; });
	return totalEnergy;
};

utils.getAnyCreep = () => {
	return Game.creeps[Object.keys(Game.creeps)[0]];
};

utils.nonFullContainerCount = () => {
	const creep = utils.getAnyCreep();
	const notFullContainerFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] < s.storeCapacity);
	return creep.room.find(FIND_STRUCTURES, {filter: notFullContainerFilter}).length;
};

utils.numConstructionSites = () => {
	const creep = utils.getAnyCreep();
	return creep.room.find(FIND_CONSTRUCTION_SITES);
};

utils.anyWallsFallen = () => {
	const creep = utils.getAnyCreep();
	const filter = s => s.structureType == STRUCTURE_WALL && s.hit < 1;
	return creep.room.find(FIND_STRUCTURES, {filter: filter}).length;
};

utils.clearExpiredCreeps = () => {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('RIP:', name);
        }
    }
};

utils.getRoomName = () => 'W1N7';
utils.getSpawnName = () => 'Spawnzilla_1';

module.exports = utils;