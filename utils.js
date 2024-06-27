const utils = {

  // This function should look look at the state of the world
  // and return a creep selection
  selectCreep() {

    // reset from nothing
    if (Game.creeps < 2 && generalists.length < 2) {
      return "Generalist"
    }

    // if there are enemies in the room, spawn some basic defenders
    const spawnRoom = Game.spawns['Spawn1'].room
    var hostiles = spawnRoom.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      return 'Defender'
    }

    // count each roles
    const generalists = _.filter(Game.creeps, (creep) => creep.memory.role == 'Generalist');
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'Harvester');
    const haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'Hauler');
    const workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'Worker');


    // if we have less than full energy, and at least 1 harvester and hauler, return
    if (spawnRoom.energyAvailable < spawnRoom.energyCapacityAvailable
      && harvesters.length > 0
      && haulers.length > 0) {
      return ""
    }


    // First, if there aren't enough creeps, make a few generalists
    if (haulers.length < harvesters.length) {
      return "Hauler"
    }
    else if (harvesters.length < Object.keys(Memory.sources).length) {
      return "Harvester"
    }
    else if (spawnRoom.energyAvailable == spawnRoom.energyCapacityAvailable
      && workers.length < 8) {
      return "Worker"
    }
  },

  /*
  * This function plans and lay construction sites
  */
  planBuildings(room) {

    // Only allow single construction site at a time
    if (room.find(FIND_CONSTRUCTION_SITES).length > 0) {
      return
    }

    //const MAX_EXTENSIONS = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][Game.spawns['Spawn1'].room.controller.level];
    //const MAX_TOWERS = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][Game.spawns['Spawn1'].room.controller.level];
    //const MAX_CONTAINERS = CONTROLLER_STRUCTURES[STRUCTURE_CONTAINER][room.controller.level];


    // CONTAINERS at SOURCES
    // find containers
    const containers = room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
    });
    // if missing containers
    if (containers.length < Object.keys(Memory.sources).length) {
      Object.keys(Memory.sources).forEach(sourceId =>
        openPosition = this.findNearestOpenPosition(sourceId, Game.spawns['Spawn1']))

      if (openPosition) {
        room.createConstructionSite(openPosition.x, openPosition.y, STRUCTURE_CONTAINER);
      }
    }
  },



  /**
   * Find the nearest open position around a source to the spawn
   * @param {Source} source
   * @param {StructureSpawn} spawn
   * @return {RoomPosition|null} The nearest open position around the source or null if no position is found
   */
  findNearestOpenPosition(sourceId, spawn) {
    const source = Game.getObjectById(sourceId)
    const terrain = new Room.Terrain(source.room.name);
    const positions = [
      { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
      { x: -1, y: 0 }, /* source */ { x: 1, y: 0 },
      { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ];

    let nearestPosition = null;
    let shortestDistance = Infinity;

    positions.forEach(pos => {
      const x = source.pos.x + pos.x;
      const y = source.pos.y + pos.y;

      // Check if the position is within room boundaries and is walkable terrain
      if (x >= 0 && x < 50 && y >= 0 && y < 50 && terrain.get(x, y) !== TERRAIN_MASK_WALL) {
        // Check if there's already a structure or construction site at the position
        const structures = source.room.lookForAt(LOOK_STRUCTURES, x, y);
        const constructionSites = source.room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
        if (structures.length === 0 && constructionSites.length === 0) {
          const distance = spawn.pos.getRangeTo(x, y);
          if (distance < shortestDistance) {
            nearestPosition = new RoomPosition(x, y, source.room.name);
            shortestDistance = distance;
          }
        }
      }
    })
    return nearestPosition;
  },


  hasRespawned() {
    // check for multiple calls on same tick
    if (Memory.respawnTick && Memory.respawnTick === Game.time) {
      return true
    }

    // server reset or sim
    if (Game.time === 0) {
      Memory.respawnTick = Game.time
      return true
    }

    // check for 0 creeps
    for (const creepName in Game.creeps) {
      return false
    }

    // check for only 1 room
    const rNames = Object.keys(Game.rooms)
    if (rNames.length !== 1) {
      return false
    }

    // check for controller, progress and safe mode
    const room = Game.rooms[rNames[0]]
    if (
      !room.controller ||
      !room.controller.my ||
      room.controller.level !== 1 ||
      room.controller.progress ||
      !room.controller.safeMode ||
      room.controller.safeMode <= SAFE_MODE_DURATION - 1
    ) {
      return false
    }

    // check for 1 spawn
    if (Object.keys(Game.spawns).length > 1) {
      return false
    }

    // if all cases point to a respawn, you've respawned
    Memory.respawnTick = Game.time
    return true
  }
}

module.exports = utils;
