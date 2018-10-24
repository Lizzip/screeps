const utils = require('utils');

const roleScout = {
    classes: [
        {
            type: "basic",
            format: [CLAIM, MOVE]
        }
    ]
};

roleScout.run = creep => {
	const targetRooms = utils.unclaimedRoomsList();
	let target = null;
	
	targetRooms.some(r => {
		if(Game.map.isRoomAvailable(r)){
			target = r;
			return true;
		}
	});
	
	if(target){
		const route = Game.map.findRoute(creep.room, target);
		if(route.length > 0) {
			//Move to new room
			console.log('Now heading to room ' + route[0].room);
			const exit = creep.pos.findClosestByRange(route[0].exit);
			creep.moveTo(exit);
		}
		else {
			//If we don't own the controller, claim it
			if(!creep.room.controller.my){
				if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}
			
			//If we own the controller, send out the Bat Signal
			utils.spawnScoutHarvesterForRoom(creep.room.name);
		}
	}
};

module.exports = roleScout;