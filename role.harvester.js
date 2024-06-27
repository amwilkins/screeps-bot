module.exports = {
  run: function (creep) {

    if (creep.memory.state = "none") {
      creep.memory.state = 'harvesting'
    }
    // Set workPlace
    if (!creep.memory.workPlace) {
      sources = Memory.sources
      for (let source in Memory.sources) {
        if (Memory.sources[source] == null) {
          Memory.sources[source] = creep.name;
          creep.memory.workPlace = source;
          creep.memory.state = 'harvesting'
          break;
        }
      }
    }
  }
};
