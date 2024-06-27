module.exports = {
  run: function (creep) {

    // Take self to recycle there are enough other creeps 
    if (creep.room.find(FIND_MY_CREEPS).length > 4) {
      creep.moveTo(creep.mySpawn)
      if (creep.pos.isNearTo(Game.spawns["Spawn1"]))
        creep.suicide();
    }

    // set creep state
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
    }
    else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
    }

    if (creep.memory.working == true) {
      if (creep.room.controller.ticksToDowngrade < 2500) {
        var controller = creep.room.controller
        if (creep.pos.inRangeTo(controller, 3)) creep.upgradeController(controller)
        else creep.moveTo(controller)

      }

      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (((s.structureType == STRUCTURE_STORAGE
          || s.structureType == STRUCTURE_CONTAINER)
          && s.store[RESOURCE_ENERGY] < s.storeCapacity)
          ||
          ((s.structureType == STRUCTURE_SPAWN
            || s.structureType == STRUCTURE_EXTENSION
            || s.structureType == STRUCTURE_TOWER)
            && s.energy < s.energyCapacity))
      });

      if (structure != undefined) {
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      }

    }
    else {
      var source = creep.pos.findClosestByPath(FIND_SOURCES)
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    }
  }
}
