exports.ljGame = function () {
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
    this.quantity_diff = 1.2;
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
    this.is_entity_spawn_done = false;
    this.game_time = 0;
    this.pre_execute = 0;
    this.pre_execute_value = {};
    this.pre_execute_time = 0;
    this.game_step = [];
    this.is_drop_resource = false;
    this.drop_resource_locations = [];
    this.drop_resource_warning_time = 0;

    Number.prototype.between = function (a, b) {
        var min = Math.min.apply(Math, [a, b]);
        var max = Math.max.apply(Math, [a, b]);

        return this > min && this < max;
    };

    Number.prototype.lucky = function () {
        var get = parseInt(Math.random() * 100);

        return (get < this);
    };

    Array.prototype.clone = function() {
        return this.slice(0);
    };

    this.random_int = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    this.random_location = function (min_range, max_range, default_value) {
        default_value = (typeof default_value !== 'undefined') ?  default_value : false;
        direction = [
            (50).lucky() ?  1 : -1,
            (50).lucky() ?  1 : -1,
            (50).lucky() ?  1 : -1
        ];

        if (default_value == "y") {
            var debug = [
                this.random_int(min_range, max_range) * direction[0],
                0,
                this.random_int(min_range, max_range) * direction[2]
            ];

            console.log(debug);

            return debug;
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
        xyz = xyz.clone();

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

        if (this.level == 0)
        {
            speed_up = false;
            strong_up = false;
            entity.setBaby(false);
        }

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
        this.player.chat("level " + this.level.toString() + " is comming.");
    };

    this.post_game_step = function () {
        this.level_up();
        this.is_entity_spawn_done = true;
    };

    this.game_step_basic = function () {
        this.pre_game_step();

        var spawn_point = [];
        var resource_point = [];
        var entity_quantity = this.get_entity_quantity();
        var em = [];

        spawn_point.push(this.get_point(this.random_location(20, 30, "y")));
        spawn_point.push(this.get_point(this.random_location(12, 25, "y")));
        spawn_point.push(this.get_point(this.random_location(15, 25, "y")));
        spawn_point.push(this.get_point(this.random_location(10, 30, "y")));
        spawn_point.push(this.get_point(this.random_location(10, 20, "y")));

        for (var i = 0; i < entity_quantity; i++) {
            var point = this.random_int(1, 5);

            this.spawn_entity(spawn_point[point]);
        }

        this.post_game_step();
    };

    this.start_next_step = function () {
        if (this.game_step[this.level])
        {
            (this.game_step[this.level])(this);
        }
        else
        {
            this.game_step_basic();
        }

        return true;
    };

    this.game_step[5] = function (ljGame) {
        ljGame.pre_game_step();

        ljGame.pre_execute_time = ljGame.game_time + 5;
        ljGame.player.chat("The weather does not look very good.");
        ljGame.player.chat("we need to move on. 5sec...?");

        ljGame.pre_execute_value = {x: ljGame.player.location.x, z: ljGame.player.location.z};

        ljGame.pre_execute = function (ljGame) {
            var start_x = ljGame.pre_execute_value.x - 5;
            var start_z = ljGame.pre_execute_value.z - 5;

            for (var rx = 0; rx < 10; rx ++)
            {
                for (var rz = 0; rz < 10; rz++)
                {
                    spawn_location = new org.bukkit.Location(ljGame.player.world, start_x + rx, ljGame.map.center[1], start_z + rz);
                    ljGame.player.world.strikeLightning(spawn_location);
                }
            }
        };

        ljGame.spawn_entity([0, 0, 0], ljGame.entity_type.CHICKEN);

        ljGame.post_game_step();
    };

    this.set_block = function (xyz, data) {
        var location = this.get_point(xyz);

        location.block.setTypeId(data[0]);
        location.block.setData(data[1]);
    };

    this.get_drop_resource_warning_points = function (xyz, default_option) {
        default_option = (typeof default_option !== 'undefined') ?  default_option : true;

        var x = xyz[0];
        var y = xyz[1] + 6 + (this.drop_resource_warning_time % 2);
        var z = xyz[2];

        if (default_option == "up")
        {
            var y = xyz[1] + 6 + 1;
        }

        if (default_option == "down")
        {
            var y = xyz[1] + 6;
        }

        var xyzs = [
            [x, y, z],
            [x + 0, y + 1, z + 1],
            [x - 0, y + 1, z - 1],
            [x + 1, y + 1, z + 0],
            [x - 1, y + 1, z - 0],

            [x + 0, y + 2, z + 1],
            [x + 1, y + 2, z + 1],
            [x + 1, y + 2, z + 0],
            [x + 1, y + 2, z - 1],
            [x + 0, y + 2, z - 1],
            [x - 1, y + 2, z - 1],
            [x - 1, y + 2, z + 0],
            [x - 1, y + 2, z + 1],

            [x, y + 2, z],
            [x, y + 3, z],
            [x, y + 4, z],
            [x, y + 5, z]
        ];

        return xyzs;
    };

    this.drop_resource_warning_block_clear = function () {
        for (var i = 0; i < this.drop_resource_locations.length; i++)
        {
            var xyz = this.drop_resource_locations[i];
            var xyzsa = this.get_drop_resource_warning_points(xyz, "up");
            var xyzsb = this.get_drop_resource_warning_points(xyz, "down");
            var xyzs = xyzsa.concat(xyzsb);

            for (var xi = 0; xi < xyzs.length; xi++)
            {
                this.set_block(xyzs[xi], [0, 0]);
            }
        }
    };

    this.drop_resource_warning = function () {
        this.drop_resource_warning_block_clear();

        for (var i = 0; i < this.drop_resource_locations.length; i++)
        {
            var xyz = this.drop_resource_locations[i];
            var xyzs = this.get_drop_resource_warning_points(xyz);

            for (var xi = 0; xi < xyzs.length; xi++)
            {
                this.set_block(xyzs[xi], [95, 1]);
            }
        }
    };

    this.drop_resource_warning_done = function () {
        this.drop_resource_warning_block_clear();
        this.drop_resource_locations = [];
    };

    this.drop_resource_rule = function () {
        if (! this.is_drop_resource)
        {
            this.spawn_resource(this.random_location(10, 30, "y"));
            this.spawn_resource(this.random_location(10, 30, "y"));
        }

        if (this.drop_resource_warning_time > 0)
        {
            this.drop_resource_warning();
        }

        if (this.drop_resource_warning_time == 0)
        {
            this.drop_resource_warning_done();
        }
    };

    this.spawn_entity_rule = function () {
        if (this.regist_entity.length < 8)
        {
            if (this.next_step_time > 0 && this.next_step_time < 20)
            {
                this.spawn_warning();
            }

            if (this.next_step_time == 0 && this.is_entity_spawn_done == true)
            {
                this.next_step_time = 20;
                this.is_entity_spawn_done = false;
                this.is_drop_resource = false;
            }

            if (! this.is_entity_spawn_done && this.next_step_time == 0)
            {
                this.start_next_step();
            }
        }
    };

    this.game_step_execute = function () {
        this.count_source();
        this.timer();

        this.drop_resource_rule();
        this.spawn_entity_rule();

        if (this.pre_execute_time == this.game_time)
        {
            this.pre_execute(this);
            this.pre_execute = 0;
            this.pre_execute_value = {};
        }

        return true;
    };

    this.timer = function () {
        this.game_time++;
        this.next_step_time--;
        this.drop_resource_warning_time--;

        if (this.next_step_time < 0)
        {
            this.next_step_time = 0;
        }

        if (this.drop_resource_warning_time < 0)
        {
            this.drop_resource_warning_time = 0;
        }
    };

    this.spawn_warning = function () {
        if (this.next_step_time != 0)
        {
            this.player.chat("level " + this.level + " start after " + this.next_step_time + " sec.");
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

    this.spawn_resource = function (spawn_point_array) {
        this.is_drop_resource = true;
        this.drop_resource_locations.push(spawn_point_array);
        this.drop_resource_warning_time = 10;

        var spawn_point = this.get_point(spawn_point_array);
        var itemType = org.bukkit.Material;
        var world = this.player.world;

        world.playEffect(spawn_point, org.bukkit.Effect.ENDER_SIGNAL, 10);
        world.playEffect(spawn_point, org.bukkit.Effect.ZOMBIE_CHEW_IRON_DOOR, 10);

        if ((5).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.DIAMOND_SPADE, 1);
            world.dropItem(spawn_point, item);
        }

        if ((10).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.BOAT, 1);
            world.dropItem(spawn_point, item);
        }

        if ((30).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.APPLE, 5);
            world.dropItem(spawn_point, item);
        }

        if ((70).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.COOKIE, 8);
            world.dropItem(spawn_point, item);
        }

        if ((80).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.EGG, 16);
            world.dropItem(spawn_point, item);
            var item = new org.bukkit.inventory.ItemStack(itemType.EGG, 16);
            world.dropItem(spawn_point, item);
        }

        if ((50).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.GOLD_SWORD, 2);
            world.dropItem(spawn_point, item);
        }

        if ((80).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.WOOD_SWORD, 2);
            world.dropItem(spawn_point, item);
        }

        if ((10).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.GOLDEN_APPLE, 2);
            world.dropItem(spawn_point, item);
        }

        if ((30).lucky())
        {
            var item = new org.bukkit.inventory.ItemStack(itemType.POTION, 2);
            world.dropItem(spawn_point, item);
        }
    };
};
