// tower code
module.exports = {
  run: function (tower) {

    // if tower is empty, don't waste the computation
    if (tower.store[RESOURCE_ENERGY] = 0) {
      return
    }

    // need some memory state for "underAttack"
    var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      this.attackTarget(tower, hostiles[0])
    }
    // else go to repair function
    else {
      this.repair(tower)
    }
  },

  repair: function (tower) {
    let targets = tower.room.find(FIND_STRUCTURES, {
      filter: structure => structure.hits < structure.hitsMax &&
        structure.structureType != STRUCTURE_WALL &&
        structure.structureType != STRUCTURE_RAMPART
    });

    // If no targets other than walls and ramparts, include them
    if (targets.length === 0) {
      targets = tower.room.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax / 10000
      });
    }
    // Sort targets by the least amount of hits
    targets.sort((a, b) => a.hits - b.hits);

    // Repair the most damaged structure
    if (targets.length > 0) {
      tower.repair(targets[0]);
    }

  },


  attackTarget: function (tower) {
    var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      tower.attack(hostiles[0])
    }
  }


}



