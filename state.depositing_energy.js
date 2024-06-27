/**
 * In depositing state, creep will deposit energy into relevant structures
 */

module.exports = function (creep) {

  // if creep has no energy in store, exit this state and remove depositTarget
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.state = "none"
    creep.memory.depositTarget = 'none'
    return
  }


  // if a relevant structure is low energy, go add energy to
  function getTarget() {
    // These are the relevant target structures
    const energyStructures = ['spawn', 'extension', 'tower'];
    for (let i in energyStructures) {
      structureType = energyStructures[i]
      if (Memory.structures[structureType]) {
        for (let j in Memory.structures[structureType]) {
          var testingStructure = Game.getObjectById(Memory.structures[structureType][j])
          if (testingStructure.energy < testingStructure.energyCapacity) {
            return testingStructure.id
          }
        }
      }
    }
  }

  // set deposite target id into creep memory
  if (creep.memory.depositTarget == 'none') {
    creep.memory.depositTarget = getTarget()
  }



  // Deposit in structure
  if (creep.memory.depositTarget != 'none') {
    depositTarget = Game.getObjectById(creep.memory.depositTarget)
    if (!depositTarget) {
      creep.memory.state = 'none'
      return
    }

    // if structure has become full, choose a new structure
    if (depositTarget.energy == depositTarget.energyCapacity) {
      creep.memory.depositTarget = getTarget()
    }
    else {
      if (creep.transfer(depositTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(depositTarget);
      }
    }
  }
}
