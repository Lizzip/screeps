const utils = require('utils');

const AI = {};

AI.locateEnergySource = creep => {
    // Priority Order
    // 1) Dropped resource with more resource than the creep can carry
    // 2) Closest container with more resource than the creep can carry
    // 3) Any dropped resource
    // 4) Harvest source if creep has WORK part
    // 5) Closest container with fewer resources than the creep can carry
    // 6) No way of getting energy, go sit at Flag1 and wait for death

    const maxCarry = creep.carryCapacity;
    let target = AI.getDroppedEnergy(creep, maxCarry);

    if (target) {
        //Dropped resource with more resource than creep can carry
        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return;
    }

    target = AI.getContainer(creep, maxCarry);

    if (target) {
        //Container with more resource than creep can carry
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return;
    }

    target = AI.getDroppedEnergy(creep, 1);

    if (target) {
        //Any dropped resource
        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return;
    }

    if (AI.hasWorkPart(creep)) {
        target = creep.room.find(FIND_SOURCES)[0];

        //Harvest source if creep has WORK part
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#FFE56D' } });
        }
        return;
    }

    target = AI.getContainer(creep, 1);

    if (target) {
        //Container with less resource than creep can carry
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return;
    }

    //No way of getting energy, go sit at Flag1 and wait for death
    if (Game.flags.Flag1) {
        creep.moveTo(Game.flags.Flag1.pos);
    }
};

AI.getDroppedEnergy = (creep, requiredEnergy) => {
    const droppedEnergyFilter = d => (d.amount >= requiredEnergy && d.resourceType == RESOURCE_ENERGY);
    return creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: droppedEnergyFilter });
};

AI.getContainer = (creep, requiredEnergy, sort = false) => {
    const containersFilter = s => (s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] >= requiredEnergy);
    const containers = creep.room.find(FIND_STRUCTURES, { filter: containersFilter });

    if (!containers.length) return null;
    return creep.pos.findClosestByPath(containers);
};

AI.hasWorkPart = creep => {
    const parts = creep.body;
    return parts.some(b => {
        return b.type == 'work';
    });
};

AI.provideEnergyToStructure = creep => {
    // Priority Order
    // 1) Spawner
    // 2) Tower < 50%
    // 3) Extension
    // 4) Tower

    let filter = s => s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity;
    let targets = creep.room.find(FIND_STRUCTURES, { filter: filter });
    let target = null;

    //Spawner
    if (targets.length) target = targets[0];

    //Tower < 50%
    if (!target) {
        filter = s => (s.structureType == STRUCTURE_TOWER && s.energy < (s.energyCapacity / 2));
        targets = creep.room.find(FIND_STRUCTURES, { filter: filter });
        if (targets.length) target = targets[0];
    }

    //Extension
    if (!target) {
        filter = s => (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity);
        targets = creep.room.find(FIND_STRUCTURES, { filter: filter });
        if (targets.length) target = targets[0];
    }

    //Tower
    if (!target) {
        filter = s => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity);
        targets = creep.room.find(FIND_STRUCTURES, { filter: filter });
        if (targets.length) target = targets[0];
    }

    if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
        }
        return true;
    } else return false;
};

module.exports = AI;