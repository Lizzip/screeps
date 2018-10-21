const utils = require('utils');
const roleBrute = {};

roleBrute.run = creep => {
	let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	
	if(target){
		console.log(creep.attack(target));
		if(creep.attack(target) == ERR_NOT_IN_RANGE){
			creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
		}
	}
	else {
		target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
		
		if(target){
			if(creep.attack(target) == ERR_NOT_IN_RANGE){
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
			}
		}
		else {
			creep.moveTo(Game.flags.Flag1.pos);
		}
	}
};

roleBrute.spawn = spawner => {	
	const role = 'brute';
	const currentEnergy = utils.currentAvailableBuildEnergy(spawner);
	const wallsDown = utils.anyWallsFallen();
	
	const classes = [
		{
			type: "horse",
			cost: 450,
			format: [TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, ATTACK]
		},
		{
			type: "archer",
			cost: 330,
			format: [MOVE, MOVE, ATTACK, RANGED_ATTACK]
		},
		{
			type: "melee",
			cost: 190,
			format: [TOUGH, MOVE, MOVE, ATTACK]
		}
	];
	
	classes.some(c => {
		if(c.cost <= currentEnergy){
			let newName = `${utils.getRandomName()} - ${c.type} ${role}`;
			
			//Only enable melee types for now
			if(c.type == 'horse') return false;
			if(c.type == 'archer'/* && wallsDown*/) return false;
			if(c.type == 'melee' && !wallsDown) return false;
			
			console.log('Spawning new Brutus: ' + newName);
			spawner.spawnCreep(c.format, newName, { memory: { role: role } });
			return true;
		}
	});
};

module.exports = roleBrute;