/**
 * In Harvest state, creeps mine energy from sources. When they are full, they
 * decide what to do with that energy.
 */

module.exports = function (creep) {

  const workPlace = Game.getObjectById(creep.memory.workPlace)

  const structures = creep.room.lookForAtArea(
    LOOK_STRUCTURES,
    workPlace.pos.y - 1, workPlace.pos.x - 1,
    workPlace.pos.y + 1, workPlace.pos.x + 1,
    true
  );
  container = structures.filter(structure => structure.structureType == STRUCTURE_CONTAINER);
  for (var s in structures) {
    if (structures[s].structure.structureType == STRUCTURE_CONTAINER) {
      container = structures[s].structure
    }
  }


  if (creep.harvest(workPlace) == ERR_NOT_IN_RANGE) {
    if (container.pos) {
      creep.moveTo(container.pos)
    }
    else {
      creep.moveTo(workPlace)
    }
  }

}
