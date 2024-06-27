/**
 * In working state, creep will build structures,
 * then if no structures need to be build, creep with upgrade
 */

module.exports = function (creep) {

  // if creep has no energy in store, exit this state
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.state = "none"
    return;
  }


  if (creep.room.controller.ticksToDownGrade < 3000) {
    // upgrade
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
    return;
  }

  var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
  if (targets.length) {
    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0]);
    }
  }

  // upgrade
  else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller);
  }

};
