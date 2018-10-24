const utils = require('utils');

const structures = {
	"W1N7": {
		spawns: { type: STRUCTURE_SPAWN, loc: [[41,36]]},
		towers: { type: STRUCTURE_TOWER, loc: [[37,37],[33,35]]},
		walls: { type: STRUCTURE_WALL, loc: [[2,28],[2,29],[8,35],[9,35],[10,35],[16,40],[16,41],[16,42],[1,44],[2,44],[2,43],[2,42],[2,41],[2,40],[2,39]]},
		extensions: { type: STRUCTURE_EXTENSION, loc: []},
		containers: { type: STRUCTURE_CONTAINER, loc: [[35,31],[15,23],[35,30]]},
		ramparts: { type: STRUCTURE_RAMPART, loc: [[16,43],[41,36]]},
		storage: { type: STRUCTURE_STORAGE, loc: [35,36]},
		roads: { type: STRUCTURE_STORAGE, loc: []}
	},
	"W2N7": {
		spawns: { type: STRUCTURE_SPAWN, loc: [[16,38]]},
		towers: { type: STRUCTURE_TOWER, loc: []},
		walls: { type: STRUCTURE_WALL, loc: [[13,39],[13,40],[13,41],[13,42],[13,43],[16,36],[17,36],[18,36],[19,36]]},
		extensions: { type: STRUCTURE_EXTENSION, loc: []},
		containers: { type: STRUCTURE_CONTAINER, loc: []},
		ramparts: { type: STRUCTURE_RAMPART, loc: []},
		storage: { type: STRUCTURE_STORAGE, loc: []},
		roads: { type: STRUCTURE_STORAGE, loc: []}
	}
};

structures.buildMissingStructures = () => {
	const rooms = Object.keys(structures);
	rooms.forEach(room => {
		
	});
};

module.exports = structures;

/*
STRUCTURE_SPAWN: "spawn",
STRUCTURE_EXTENSION: "extension",
STRUCTURE_STORAGE: "road",
STRUCTURE_WALL: "constructedWall",
STRUCTURE_RAMPART: "rampart",
STRUCTURE_KEEPER_LAIR: "keeperLair",
STRUCTURE_PORTAL: "portal",
STRUCTURE_CONTROLLER: "controller",
STRUCTURE_LINK: "link",
STRUCTURE_STORAGE: "storage",
STRUCTURE_TOWER: "tower",
STRUCTURE_OBSERVER: "observer",
STRUCTURE_POWER_BANK: "powerBank",
STRUCTURE_POWER_SPAWN: "powerSpawn",
STRUCTURE_EXTRACTOR: "extractor",
STRUCTURE_LAB: "lab",
STRUCTURE_TERMINAL: "terminal",
STRUCTURE_CONTAINER: "container",
STRUCTURE_NUKER: "nuker",
*/