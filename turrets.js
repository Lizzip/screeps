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
	// Priority Order
	// 1) Attack invaders
	// 2) Heal creeps
	// 3) Repair anything except walls until at half energy
	
	const towers = room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_TOWER});
	const enemies = Game.rooms[utils.getRoomName()].find(FIND_HOSTILE_CREEPS);
	
	if(enemies.length){
		//Attack invaders
		for (let tower of towers) {
			const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (target != undefined) {
				tower.attack(target);
			}
		}
	}
	else {
		//Heal creeps
		for (let name in Game.creeps) {
			const creep = Game.creeps[name];
			if (creep.hits < creep.hitsMax) {
				towers.forEach(tower => tower.heal(creep));
			}
		}
		
		//Repair
		const filter = s => (s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL);
		for (let tower of towers) {
			if(tower.energy > (tower.energyCapacity/2)){
				const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: filter});
				if(closestDamagedStructure) {
					tower.repair(closestDamagedStructure);
				}
			}
		}
	}
};

module.exports = turrets;