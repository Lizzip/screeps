const utils = require('utils');

const structures = {
	"W1N7": {
		spawns: [[41,36]],
		towers: [[37,37],[33,35]],
		walls: [[2,28],[2,29],[8,35],[9,35],[10,35],[16,40],[16,41],[16,42],[1,44],[2,44],[2,43],[2,42],[2,41],[2,40],[2,39]],
		extensions: [],
		containers: [[35,31],[15,23],[35,30]],
		ramparts: [[16,43],[41,36]],
		storage: [35,36]
	},
	"W2N7": {
		spawns: [[16,38]],
		towers: [],
		walls: [[13,39],[13,40],[13,41],[13,42],[13,43],[16,36],[17,36],[18,36],[19,36]],
		extensions: [],
		containers: [],
		ramparts: [],
		storage: []
	}
};


structures.checkAllStructuresExistForRoom = roomName => {
	
};

structures.buildMissingStructuresForRoom = roomName => {

};

module.exports = structures;