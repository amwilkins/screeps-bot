
let defineCreep = {
  run: function (thisRoom, role, spawn) {
    let creepName = '';
    let creepAtt = {};
    let creepBody = [];

    // Create the body from function below
    creepBody = this.CreateBody(thisRoom, role);

    // Create creep blueprint
    switch (role) {
      case 'Hauler': {
        creepName = 'Hauler' + Game.time;
        creepAtt = { role: 'Hauler', mySpawn: spawn.name, myRoom: thisRoom.name, born: Game.time };
      } break;
      case 'Generalist': {
        creepName = 'Generalist' + Game.time;
        creepAtt = { role: 'Generalist', mySpawn: spawn.name, myRoom: thisRoom.name, born: Game.time };
      } break;
      case 'Harvester': {
        creepName = 'Harvester' + Game.time;
        creepAtt = { role: 'Harvester', mySpawn: spawn.name, myRoom: thisRoom.name, born: Game.time };
      } break;
      case 'Worker': {
        creepName = 'Worker' + Game.time;
        creepAtt = { role: 'Worker', mySpawn: spawn.name, myRoom: thisRoom.name, born: Game.time };
      } break;
      case 'Defender': {
        creepName = 'Defender' + Game.time;
        creepAtt = { role: 'Defender', mySpawn: spawn.name, myRoom: thisRoom.name, born: Game.time };
      } break;
      //Rest of the roles...
    }
    let result = {
      "name": creepName,
      "atts": creepAtt,
      "body": creepBody
    }
    return result;
  },

  CreateBody: function (thisRoom, role) {
    let maxEnergy = thisRoom.energyCapacityAvailable;
    let maxBodyParts;
    let uniqueBodyParts = [];
    let uniqueBodyCost = 0;
    let basicBodyParts = [];
    let basicBodyCost = 0;
    switch (role) {
      case 'Hauler': {
        basicBodyParts = [CARRY, MOVE];
        basicBodyCost = 100;
        maxBodyParts = 50;
      } break;
      case 'Generalist': {
        basicBodyParts = [WORK, CARRY, MOVE];
        basicBodyCost = 200;
        maxBodyParts = 50;
      } break;
      case 'Harvester': {
        uniqueBodyParts = [MOVE]
        uniqueBodyCost = 50;
        basicBodyParts = [WORK];
        basicBodyCost = 100;
        maxBodyParts = 6;
      } break;
      case 'Worker': {
        basicBodyParts = [WORK, CARRY, MOVE];
        basicBodyCost = 200;
        maxBodyParts = 50;
      } break;
      case 'Defender': {
        basicBodyParts = [MOVE, TOUGH, ATTACK, TOUGH];
        basicBodyCost = 150 * 2; // twice as much cost, so we make smaller defenders
        maxBodyParts = 50;
      } break;
      //Rest of the roles...
    }

    let body = [];
    // add unique body parts
    body.push(...uniqueBodyParts)
    maxEnergy -= uniqueBodyCost;
    // add repeated body sections
    while (maxBodyParts >= basicBodyParts.length + uniqueBodyParts.length && maxEnergy >= basicBodyCost) {
      body.push(...basicBodyParts);
      maxEnergy -= basicBodyCost;
      maxBodyParts -= basicBodyParts.length;
    }
    return body;
  }
};
module.exports = { defineCreep };
