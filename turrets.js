const utils = require('utils');
const turrets = {};

turrets.buildIfIsDown = room => {
	const creep = utils.getAnyCreep();
	const filter = s => s.structureType == STRUCTURE_TOWER;
	const extensions = creep.room.find(FIND_STRUCTURES, {filter: filter});
	
	if(!extensions.length){
		const loc = [37, 37];
		room.createConstructionSite(loc[0], loc[1], STRUCTURE_TOWER);
	}
};

turrets.defendRoom = room => {
	const towers = room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_TOWER});
	
	for (let tower of towers) {
		const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (target != undefined) {
			tower.attack(target);
		}
	}
};

module.exports = turrets;