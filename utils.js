const utils = {
	names: ["Alice Holliday","Alice Michelle Earp","August Hamilton","Baron Samedi","Bass Reeves","Beth Gardner","Bethany","Big Bubba","Bobo Del Rey","Bryce Cooper","Bulshar Clootie",
	"Calamity Jane","Carl","Champ Hardy","Charlie","Chrissy Nedley","Constance Clootie","Curtis McCready","Derek","Doc Holliday","Dr. Reggie","Willa Earp","Wynonna Earp","Edwin Earp",
	"Eliza Shapiro","Ewan Allenbach","Fish","Gary Smith","Gretta Perley","Gus McCready","Nicole Haught","Hetty Tate","Hypnos","Jack of Knives","Jeremy Chetri","Jim Miller","John","Jolene",
	"Jonas","Josiah Earp","Juan Carlo","Judge Cryderman","Kate","Kevin","Levi","Lou","Agent Lucado","Maeve Perley","Malcolm Ramaker","Marty","Marzaniok","Mattie Perley","Mercedes Gardner",
	"Michelle Gibson","Mictian","One Armed Clint","Perry Crofte","Poppy","Porcelain Doll","Randy Nedley","Red","Revenants","Robert Malick","Robin Jett","Rosita Bustillos","Samuel Larson",
	"Shae Pressman","Shopkeeper","Shorty","Stevie","The Widows","Theodore Roosevelt","Tucker Gardner","Ward Earp","Waverly Earp","Whiskey Jim","Wyatt Earp","Xavier Dolls"]
};

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

utils.getRandomName = () => {
	let name = utils.names[ Math.floor(Math.random()*utils.names.length)];
	
	while(utils.creepExistsWithName(name)){
		name = utils.names[ Math.floor(Math.random()*utils.names.length)];
	}
	
	return name;
}

utils.getRoomName = () => 'W1N7';
utils.getSpawnName = () => 'Spawnzilla_1';
utils.creepExistsWithName = name => !!Game.creeps[name]
utils.getAnyCreep = () => Game.creeps[Object.keys(Game.creeps)[0]];

module.exports = utils;