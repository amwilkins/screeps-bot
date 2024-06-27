function memorySetup() {
  if (!Memory.sources) {
    Memory.sources = {};
    let sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);
    for (let i = 0; i < sources.length; i++) {
      Memory.sources[sources[i].id] = null;
    }
  }

  // Store current structures in memory
  // as {structureType: [structure.id,...]}
  if (Game.time.toString().slice(-2) % 20 == 0) {

    structuresObject = {}
    var structures = Game.spawns["Spawn1"].room.find(FIND_MY_STRUCTURES);

    structures.forEach(structure => {
      let type = structure.structureType;
      // Initialize the array if it doesn't exist yet
      if (!structuresObject[type]) {
        structuresObject[type] = [];
      }

      // Add the structure ID to the array
      structuresObject[type].push(structure.id);
    });
    // Save the resulting object to memory
    if (structuresObject) {
      Memory.structures = structuresObject;
    }
  }
}


function cleanDead() {
  for (const k in Memory.creeps) {
    if (!Game.creeps[k]) {
      // if creep had a workPlace, remove it
      let sourceId = Memory.creeps[k].workPlace;
      if (sourceId) {
        Memory.sources[sourceId] = null;
      }
      delete Memory.creeps[k];
    }

  };
};

module.exports = { memorySetup, cleanDead };
