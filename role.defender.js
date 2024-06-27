/** 
  This role will spawn and attack any enemies in the main spawn room.
  Then if the attackers leave, they should go follow them into the next room

Defenders are not the strongest of attackers,
rather they are made to swarm their enemies.
Attacking at random, trying to slow and confuse their enemies.
While stronger allies do the real damage.

*/
module.exports.loop = function (creep) {

  // find random hostile creep
  const hostiles = room.find(FIND_HOSTILE_CREEPS);
  if (hostiles.length > 0) {
    const target = hostiles[Math.floor(Math.random() * hostiles.length)];
    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};
