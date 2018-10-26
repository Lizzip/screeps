const utils = require('utils');

const turrets = {};

turrets.buildIfIsDown = room => {
    const creep = utils.getAnyCreep();
    const filter = s => s.structureType == STRUCTURE_TOWER;
    const extensions = creep.room.find(FIND_STRUCTURES, { filter: filter });

    if (!extensions.length) {
        const loc = [37, 37];
        room.createConstructionSite(loc[0], loc[1], STRUCTURE_TOWER);
    }
};

turrets.defendAllRooms = () => {
	const rooms = Object.keys(Game.rooms);
	rooms.forEach(room => {
		turrets.defendRoom(Game.rooms[room]);
	});
};

turrets.defendRoom = room => {
    // Priority Order
    // 1) Attack invaders
    // 2) Heal creeps
    // 3) Repair anything except walls until at half energy

    const towers = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER });
	
	if(towers.length){	
		const enemies = room.find(FIND_HOSTILE_CREEPS);
		
		if (enemies.length) {
			//Attack invaders
			for (let tower of towers) {
				const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
				if (target != undefined) {
					tower.attack(target);
				}
			}
		} else {
			//Heal creeps
			for (let name in Game.creeps) {
				const creep = Game.creeps[name];
				if (creep.hits < creep.hitsMax) {
					towers.forEach(tower => tower.heal(creep));
				}
			}

			//Repair (if not in panic mode)
			/*if (!utils.inPanicMode()) {
				const filter = s => (s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_ROAD);
				for (let tower of towers) {
					if (tower.energy > (tower.energyCapacity / 2)) {
						const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, { filter: filter });
						if (closestDamagedStructure) {
							tower.repair(closestDamagedStructure);
						}
					}
				}
			}*/
		}
	}
};

module.exports = turrets;