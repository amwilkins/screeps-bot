module.exports = {
  run: function (creep) {

    if (creep.memory.state == 'none' || !creep.memory.state) {
      // Gathering materials
      if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.state = "gathering"
      }

      // Depositing materials
      else if (creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
        creep.memory.state = "working"
      }
    }
  }
};
