const utils = {
    names: ["Alice Holliday", "Alice Michelle Earp", "August Hamilton", "Baron Samedi", "Bass Reeves", "Beth Gardner", "Bethany", "Big Bubba", "Bobo Del Rey", "Bryce Cooper", "Bulshar Clootie",
        "Calamity Jane", "Carl", "Champ Hardy", "Charlie", "Chrissy Nedley", "Constance Clootie", "Curtis McCready", "Derek", "Doc Holliday", "Dr. Reggie", "Willa Earp", "Wynonna Earp", "Edwin Earp",
        "Eliza Shapiro", "Ewan Allenbach", "Fish", "Gary Smith", "Gretta Perley", "Gus McCready", "Nicole Haught", "Hetty Tate", "Hypnos", "Jack of Knives", "Jeremy Chetri", "Jim Miller", "John", "Jolene",
        "Jonas", "Josiah Earp", "Juan Carlo", "Judge Cryderman", "Kate", "Kevin", "Levi", "Lou", "Agent Lucado", "Maeve Perley", "Malcolm Ramaker", "Marty", "Marzaniok", "Mattie Perley", "Mercedes Gardner",
        "Michelle Gibson", "Mictian", "One Armed Clint", "Perry Crofte", "Poppy", "Porcelain Doll", "Randy Nedley", "Red", "Revenants", "Robert Malick", "Robin Jett", "Rosita Bustillos", "Samuel Larson",
        "Shae Pressman", "Shopkeeper", "Shorty", "Stevie", "The Widows", "Theodore Roosevelt", "Tucker Gardner", "Ward Earp", "Waverly Earp", "Whiskey Jim", "Wyatt Earp", "Xavier Dolls"
    ],
	costs: {
		move: 50,
		work: 100,
		carry: 50,
		attack: 80,
		ranged_attack: 150,
		heal: 250,
		claim: 600,
		tough: 10
	}
};

utils.calculateSpawnCost = bodyArray => {
	let cost = 0;
	bodyArray.forEach(part => {
		if(utils.costs.hasOwnProperty(part)){
			cost += utils.costs[part];
		}
	});
	return cost;
};

utils.hostileCount = () => {
    const roomName = utils.getRoomName();
    return Game.rooms[roomName].find(FIND_HOSTILE_CREEPS).length;
};

utils.inPanicMode = () => {
    const minRoomEnergy = 500;
    const spawnName = utils.getSpawnName();
    if (utils.currentAvailableBuildEnergy(Game.spawns[spawnName]) > minRoomEnergy) return false;

    //If there are 0 carriers then we are in panic mode
    //Every builder and repairer temporarily acts as a carrier/harvester
    const keys = Object.keys(Game.creeps);
    for (let i = 0; i < keys.length; i++) {
        const creep = Game.creeps[keys[i]];
        if (creep.memory.role == 'carrier') return false;
    }
    return true;
};

utils.getControllerLevel = () => {
    const creep = utils.getAnyCreep();
    const filter = s => s.structureType == STRUCTURE_CONTROLLER;
    const controller = creep.room.find(FIND_STRUCTURES, { filter: filter })[0];

    return controller.level;
};

utils.maxPossibleBuildEnergy = () => {
    const creep = utils.getAnyCreep();
    const spawnCapacity = 300;
    const extensionCapacity = 50;

    const filter = s => s.structureType == STRUCTURE_EXTENSION;
    const extensions = creep.room.find(FIND_STRUCTURES, { filter: filter });
    return spawnCapacity + (extensionCapacity * extensions.length);
};

utils.currentAvailableBuildEnergy = spawner => {
    const creep = utils.getAnyCreep();
    const filter = s => s.structureType == STRUCTURE_EXTENSION;
    const extensions = creep.room.find(FIND_STRUCTURES, { filter: filter });

    let totalEnergy = spawner.energy;
    extensions.forEach(e => { totalEnergy += e.energy; });
    return totalEnergy;
};

utils.nonFullContainerCount = () => {
    const creep = utils.getAnyCreep();
    const notFullContainerFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] < s.storeCapacity);
    return creep.room.find(FIND_STRUCTURES, { filter: notFullContainerFilter }).length;
};

utils.numConstructionSites = () => {
    const creep = utils.getAnyCreep();
    return creep.room.find(FIND_CONSTRUCTION_SITES).length;
};

utils.anyWallsFallen = () => {
    const expectedWallCount = 15;
    const creep = utils.getAnyCreep();

    let filter = s => s.structureType == STRUCTURE_WALL;
    const allWalls = creep.room.find(FIND_STRUCTURES, { filter: filter });
    if (allWalls < expectedWallCount) return true;

    filter = s => s.structureType == STRUCTURE_WALL && s.hit < 2;
    return creep.room.find(FIND_STRUCTURES, { filter: filter }).length;
};

utils.getRandomName = () => {
    let name = utils.names[Math.floor(Math.random() * utils.names.length)];

    while (utils.creepExistsWithName(name)) {
        name = utils.names[Math.floor(Math.random() * utils.names.length)];
    }

    return name;
}

utils.getCreepWithMemory = (k, v) => {
	const creeps = Object.keys(Game.creeps);
	let creep = null;
	
	creeps.some(c => {
		if(Game.creeps[c].memory.hasOwnProperty(k) && Game.creeps[c].memory[k] == v){
			creep = Game.creeps[c];
			return true;
		}
	});
	
	return creep;
};

//Spawn utilities
utils.getSpawnersInCurrentRoom = () => utils.getCurrentRoom.find(FIND_MY_SPAWNS); 
utils.getSpawnersInRoom = room => room.find(FIND_MY_SPAWNS); 
utils.getSpawnName = () => 'Spawnzilla_1';
utils.spawnScoutHarvesterForRoom = (room, cb) => {
	const roomName = utils.claimedRoomsList()[0];
	const spawners = utils.getSpawnersInRoom(Game.rooms[roomName]);
	
	if(spawners.length){
		const spawner = spawners[0];
		const currentEnergy = utils.currentAvailableBuildEnergy(spawner);
		console.log("Spawning scoutHarvester next");
		const format = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
		const cost = utils.calculateSpawnCost(format);
		const newName = `Scout Harvester: ${utils.getRandomName()}`;
		if (cost <= currentEnergy) {
			if (spawner.spawnCreep(format, newName, { memory: { role: 'scoutHarvester', spawnedBy: spawner.name, targetRoom: room } }) == OK) {
				console.log('Spawning ' + newName);
				if(cb) cb();
			}
		}
	}
	
}	

//Creep utilities
utils.creepExistsWithName = name => !!Game.creeps[name]
utils.getAnyCreep = () => Game.creeps[Object.keys(Game.creeps)[0]];
utils.getHeadCount = () => Object.keys(Game.creeps).length;

//Room utilities
utils.getRoomNamesList = () => ["W1N7", "W2N7"];
utils.claimedRoomsList = () => ["W1N7"];
utils.unclaimedRoomsList = () => ["W2N7"]; //List of rooms to send scouts classes to 
utils.getRoomName = () => utils.getAnyCreep().room.name;
utils.getCurrentRoom = () => utils.getAnyCreep().room.name;
utils.getCurrentRoomIndex = () => utils.getRoomNamesList().indexOf(utils.getAnyCreep().room.name);
//utils.getRoomList = () => 

//Controllers
utils.getControllerInCurrentRoom = () => utils.getCurrentRoom().controller;

module.exports = utils;