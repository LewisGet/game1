var kernel = require('ljSystem');

exports.init = kernel;

events.entityDeath(function (event) {
    var entity = event.getEntity();

    if (entity == kernel.ljGame.player)
    {
        entity.chat("game over");
        entity.chat("source: " + kernel.ljGame.source.toString() + " kills.");
        kernel.ljGame.game_timer.cancel();
    }
});
