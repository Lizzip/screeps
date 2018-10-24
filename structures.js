const utils = require('utils');

const structures = {
	"W1N7": {
		walls: [[2,28],[2,29],[8,35],[9,35],[10,35],[16,40],[16,41],[16,42]],
		towers: [[37,37],[33,35]],
		spawns: [[41,36]],
		containers: [[35,31],[15,23],[35,30]],
		extensions: [],
		ramparts: [[16,43],[41,36]],
		storage: [35,36]
	},
	"W2N7": {
		walls: [],
		towers: [],
		spawns: [],
		containers: [],
		extensions: [],
		ramparts: [],
		storage: []
	}
};


structures.checkAllStructuresExistForRoom = roomName => {
	
};

structures.buildMissingStructuresForRoom = roomName => {

};

module.exports = structures;