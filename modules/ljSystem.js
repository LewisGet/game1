Number.prototype.between = function (a, b) {
    var min = Math.min.apply(Math, [a, b]);
    var max = Math.max.apply(Math, [a, b]);

    return this > min && this < max;
};

Number.prototype.lucky = function () {
    var get = parseInt(Math.random() * 100);

    return (get < this);
};

ljGame = function () {
    this.player = 0;
    this.playerId = "LewisJang";
    this.map = {
        width: 250,
        height: 250,
        center: [41.5, 4, -553.5]
    };
    this.default_strong_entity_probability = 3;
    this.default_speed_entity_probability = 10;
    this.default_entity_quantity = 15;
    this.quantity_diff = 1.5;
    this.speed_probability_diff = 1.3;
    this.strong_probability_diff = 1.3;
    this.max_speed_probability = 80;
    this.max_strong_probability = 50;
    this.level = 0;
    this.source = 0;
    this.entity_type = org.bukkit.entity.EntityType;
    this.game_timer = 0;
    this.regist_entity = [];
    this.next_step_time = 20;
    this.game_step = [];

    this.random_int = function (min_range, max_range) {
        var range = min_range - max_range;

        return parseInt(Math.random() * range) + min_range;
    };

    this.random_location = function (min_range, max_range, default_value) {
        default_value = (typeof default_value !== 'undefined') ?  default_value : false;
        direction = [
            (50).lucky() ?  1 : -1,
            (50).lucky() ?  1 : -1,
            (50).lucky() ?  1 : -1
        ];

        if (default_value == "y") {
            return [
                this.random_int(min_range, max_range) * direction[0],
                0,
                this.random_int(min_range, max_range) * direction[2]
            ];
        }

        return [
            this.random_int(min_range, max_range) * direction[0],
            this.random_int(min_range, max_range) * direction[1],
            this.random_int(min_range, max_range) * direction[2]
        ];
    };

    this.all_die = function (entitites) {
        for (var i = 0; i < entitites.length; i++)
        {
            if (! entitites[i].dead)
            {
                return false;
            }
        }

        return true;
    };

    this.get_point = function (xyz) {
        xyz[0] += this.map.center[0];
        xyz[1] += this.map.center[1];
        xyz[2] += this.map.center[2];

        return new org.bukkit.Location(this.player.world, xyz[0], xyz[1], xyz[2]);
    };

    this.spawn_entity = function (spawn_point, entity_type) {
        spawn_point = (typeof spawn_point !== 'undefined') ?  spawn_point : [0, 0, 0];
        entity_type = (typeof entity_type !== 'undefined') ?  entity_type : this.entity_type.ZOMBIE;

        if (Array.isArray(spawn_point))
        {
            spawn_point = this.get_point(spawn_point);
        }

        var level = 3;
        var time = 999;
        var potion_type = org.bukkit.potion.PotionEffectType;

        var name = "default";
        var entity = this.player.world.spawnEntity(spawn_point, entity_type);
        var speed_up = (this.get_speed_probability()).lucky();
        var strong_up = (this.get_strong_probability()).lucky();

        entity.setTarget(this.player);

        if (speed_up)
        {
            var potion = new org.bukkit.potion.PotionEffect(potion_type.SPEED, time, level);
            entity.addPotionEffect(potion);

            name = (name == "default") ? "" : name;
            name += " speed";
        }

        if (strong_up)
        {
            entity.setMaxHealth(50);
            entity.setHealth(50);

            name = (name == "default") ? "" : name;
            name += " strong";
        }

        entity.setCustomName(org.bukkit.ChatColor.AQUA + name);
        entity.setCustomNameVisible(true);

        this.regist_entity.push(entity);
    };

    this.level_up = function () {
        this.level++;
    };

    this.get_entity_quantity = function () {
        var num = this.default_entity_quantity;

        num += parseInt(this.level * this.quantity_diff);

        return num;
    };

    this.get_strong_probability = function () {
        var num = this.default_strong_entity_probability;

        num += parseInt(this.level * this.strong_probability_diff);

        if (num > this.max_strong_probability)
        {
            return this.max_strong_probability;
        }

        return num;
    };

    this.get_speed_probability = function () {
        var num = this.default_speed_entity_probability;

        num += parseInt(this.level * this.speed_probability_diff);

        if (num > this.max_speed_probability)
        {
            return this.max_speed_probability;
        }

        return num;
    };

    this.pre_game_step = function () {
        alert("level " + this.level.toString() + " is comming.");
    };

    this.post_game_step = function () {
        this.level_up();
    };

    this.game_step_basic = function () {
        this.pre_game_step();

        var spawn_point = [];
        var resource_point = [];
        var entity_quantity = this.get_entity_quantity();
        var em = [];

        spawn_point.push(this.get_point(this.random_location(20, 60, "y")));
        spawn_point.push(this.get_point(this.random_location(25, 80, "y")));
        spawn_point.push(this.get_point(this.random_location(30, 100, "y")));
        spawn_point.push(this.get_point(this.random_location(25, 80, "y")));
        spawn_point.push(this.get_point(this.random_location(30, 100, "y")));

        for (var i = 0; i < entity_quantity; i++) {
            var point = this.random_int(1, 5);

            this.spawn_entity(spawn_point[point]);
        }

        this.post_game_step();
    };

    this.start_next_step = function () {
        if (this.game_step[this.level])
        {
            (this.game_step[this.level])();
        }
        else
        {
            this.game_step_basic();
        }

        return true;
    };

    this.game_step_execute = function () {
        this.count_source();

        if (this.regist_entity.length > 8)
        {
            return false;
        }

        this.step_time_come_down();
        this.spawn_warning();

        if (this.next_step_time < 1)
        {
            this.start_next_step();
            this.next_step_time = 20;
        }

        return true;
    };

    this.step_time_come_down = function () {
        this.next_step_time--;

        if (this.next_step_time < 0)
        {
            this.next_step_time = 0;
        }
    };

    this.spawn_warning = function () {
        if (this.next_step_time != 0)
        {
            alert("level " + this.level + " start after " + this.next_step_time + " sec.");
        }
    };

    this.count_source = function () {
        for (var i = 0; i < this.regist_entity.length; i++)
        {
            if (this.regist_entity[i].dead)
            {
                this.source++;
                this.regist_entity.splice(i, 1);
            }
        }
    };
};

exports.ljGame = new ljGame();

exports.ljGame.game_timer = setInterval(function () {
    try
    {
        if (exports.ljGame.player == 0)
        {
            var defaultEntity = org.bukkit.Bukkit.getPlayer(exports.ljGame.playerId);

            if (defaultEntity)
            {
                var spawn_player_point = new org.bukkit.Location(defaultEntity.world, exports.ljGame.map.center[0], exports.ljGame.map.center[1], exports.ljGame.map.center[2]);

                exports.ljGame.player = defaultEntity;
                exports.ljGame.player.teleport(spawn_player_point);
            }
            else
            {
                throw ("entity need to init.");
            }
        }
        else
        {
            exports.ljGame.game_step_execute();
        }
    }
    catch (e)
    {
        console.log(e);
    }
}, 1000);
