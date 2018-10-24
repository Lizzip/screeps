const utils = require('utils');
const AI = require('creepAI');

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
		if(!AI.moveTowardsTargetRoom(creep, target)){
			//If we don't own the controller, claim it
			if(!creep.room.controller.my){
				if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}
			
			//If we own the controller, send out the Bat Signal
			utils.spawnScoutHarvesterForRoom(creep.room.name, () => {
				console.log("Claimer out");
				creep.suicide();
			});
		}
	}
};

module.exports = roleScout;