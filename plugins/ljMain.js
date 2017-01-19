var kernel = require('ljSystem');
var builder = require('ljMap');

exports.init = kernel;
exports.builder = builder;

events.entityDeath(function (event) {
    var entity = event.getEntity();

    if (entity == kernel.ljGame.player)
    {
        entity.chat("game over");
        entity.chat("source: " + kernel.ljGame.source.toString() + " kills.");
        kernel.ljGame.game_timer.cancel();
    }
});
