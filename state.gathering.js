/**
 * In gathering state, creep will gather resources from containers and the ground
 */

module.exports = function (creep) {

  // if creep is full of energy, exit this state
  if (creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
    creep.memory.state = "none"
    return
  }


  // find dropped energy
  var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
    filter: (d) => { return (d.resourceType == RESOURCE_ENERGY) }
  });
  if (dropenergy) {
    if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
      creep.moveTo(dropenergy)
    }
  }
  else {
    //  MAKE THIS USE THE MEMORY
    // find containers
    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.structureType == (STRUCTURE_CONTAINER
        || STRUCTURE_STORAGE)
        && s.store[RESOURCE_ENERGY] > 0
    });

    if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(structure)
    }
  }
};
