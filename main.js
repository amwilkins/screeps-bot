// Import Roles
var roleGeneralist = require('role.generalist');
var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleWorker = require('role.worker');
var roleTower = require('role.tower');

// Import States
const gathering = require('state.gathering')
const depositing_energy = require('state.depositing_energy')
const working = require('state.working')
const harvesting = require('state.harvest')

// Import utils
const { defineCreep } = require('./createCreep');
const { memorySetup } = require('./memory_setup');
const { cleanDead } = require('./memory_setup');
const utils = require('./utils')

// main loop
module.exports.loop = function () {

  // naming things
  var base1 = Game.spawns["Spawn1"]
  var room1 = base1.room

  // Set up memory
  memorySetup()

  // Prep
  cleanDead()

  // Construct buildings
  if (Game.time.toString() % 30 == 0) {
    utils.planBuildings(room1)
  }

  // run towers
  for (var t in Memory.structures.tower) {
    var tower = Game.getObjectById(Memory.structures.tower[t])
    roleTower.run(tower);
  }

  // Make Creeps
  if (room1.energyAvailable >= 300 && !base1.spawning) {
    var creep = utils.selectCreep()
    if (creep) {
      var creep = defineCreep.run(room1, creep, base1)
      base1.spawnCreep(creep.body, creep.name, { memory: creep.atts })

    }
  }

  // Push creeps to determine state
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    if (creep.memory.role == 'Generalist') {
      roleGeneralist.run(creep);
      continue
    }
    else if (creep.memory.role == 'Harvester') {
      roleHarvester.run(creep);
      continue
    }
    else if (creep.memory.role == 'Hauler') {
      roleHauler.run(creep);
      continue
    }
    else if (creep.memory.role == 'Worker') {
      roleWorker.run(creep);
      continue
    }
    // Catch all for if a creep doesn't have a role
    // This shouldn't ever happen
    else {
      creep.memory.role = 'Generalist'
      roleGeneralist.run(creep);
    }
  }

  // Make creeps do their jobs - could reduce code
  for (let name in Game.creeps) {
    var creep = Game.creeps[name]
    switch (creep.memory.state) {
      case 'gathering':
        gathering(creep);
        break
      case 'depositing_energy':
        depositing_energy(creep);
        break
      case 'working':
        working(creep);
        break
      case 'harvesting':
        harvesting(creep);
        break
    }
  }
}
