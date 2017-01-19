var kernel = require('ljSystem');
var builder = require('ljMap');

exports.init = kernel;
exports.builder = builder;

exports.game_kernel = new kernel.ljGame();

exports.game_kernel.game_timer = setInterval(function () {
    try
    {
        if (exports.game_kernel.player == 0)
        {
            var defaultEntity = org.bukkit.Bukkit.getPlayer(exports.game_kernel.playerId);

            if (defaultEntity)
            {
                var spawn_player_point = new org.bukkit.Location(defaultEntity.world, exports.game_kernel.map.center[0], exports.game_kernel.map.center[1], exports.game_kernel.map.center[2]);

                exports.game_kernel.player = defaultEntity;
                exports.game_kernel.player.teleport(spawn_player_point);
            }
            else
            {
                throw ("entity need to init.");
            }
        }
        else
        {
            exports.game_kernel.game_step_execute();
            exports.game_kernel.player.world.setTime(18000);
        }
    }
    catch (e)
    {
        console.log(e);
    }
}, 1000);

events.entityDeath(function (event) {
    var entity = event.getEntity();

    if (entity == exports.game_kernel.player)
    {
        entity.chat("game over");
        entity.chat("source: " + exports.game_kernel.source.toString() + " kills.");
        exports.game_kernel.game_timer.cancel();
        exports.game_kernel.drop_resource_warning_time = 0;
        exports.game_kernel.drop_resource_warning_block_clear();
    }
});

events.blockBreak(function (event) { 
    event.setCancelled(true);
});

events.blockPlace(function(event) {
    event.setCancelled(true);
});
