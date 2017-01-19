Number.prototype.lucky = function () {
    var get = parseInt(Math.random() * 100);

    return (get < this);
};

ljMap = function () {
    this.world = 0;
    this.center = [41.5, 4, -553.5];
    this.size = 50;

    this.set_block = function (xyz, typeId, data) {
        var location = new org.bukkit.Location(this.world, xyz[0], xyz[1], xyz[2]);

        location.block.setTypeId(typeId);
        location.block.setData(data);
    };

    this.set_block_array = function (xyz, data) {
        var location = new org.bukkit.Location(this.world, xyz[0], xyz[1], xyz[2]);

        location.block.setTypeId(data[0]);
        location.block.setData(data[1]);
    };

    this.xyz_relatively = function (x, y, xyz) {
        return [xyz[0] + x + this.center[0], xyz[1] + this.center[1], xyz[2] + y + this.center[2]];
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

    this.distance = function (a, b) {
        return Math.sqrt(((a[0] - b[0]) * (a[0] - b[0])) + ((a[1] - b[1]) * (a[1] - b[1])));
    };

    this.cross = function (x, y) {
        var dataset = [
            [[0, 0, 0], 139, 1],
            [[0, 1, 0], 139, 1],
            [[0, 2, 0], 139, 1],
            [[0, 3, 0], 139, 1],
            [[0, 4, 0], 139, 1],

            [[1, 3, 0], 139, 1],
            [[-1, 3, 0], 139, 1],
            [[0, 3, 1], 139, 1],
            [[0, 3, -1], 139, 1],

            [[0, 5, 0], 50, 5],
            [[1, 4, 0], 50, 5],
            [[-1, 4, 0], 50, 5],
            [[0, 4, 1], 50, 5],
            [[0, 4, -1], 50, 5]
        ];

        for (var i = 0; i < dataset.length; i++)
        {
            var thisData = dataset[i];
            var xyz = this.xyz_relatively(x, y, thisData[0]);

            this.set_block(xyz, thisData[1], thisData[2]);
        }
    };

    this.wall = function (x, y, startRock) {
        startRock = (typeof startRock !== 'undefined') ?  startRock : true;

        var dataset = [
            [[98, 2], [48, 0]],
            [[139, 1], [139, 0]]
        ];


        for (var i = 0; i < 9; i++)
        {
            var buildType = i % 2;

            if (! startRock)
            {
                buildType = (i + 1) % 2;
            }

            var xyz = this.xyz_relatively(x, y, [0, i, 0]);
            var data = dataset[buildType][(Math.random() > 0.5) ? 0 : 1];

            this.set_block(xyz, data[0], data[1]);
        }
    };

    this.floor = function (x, y) {
        var dataset = [
            [1, 0], [1, 5],
            [98, 0], [98, 1], [98, 2],
            [48, 0],
            [109, 0], [109, 1], [109, 2],
            [67, 0], [67, 1], [67, 2],
            [44, 3], [44, 5], [44, 11], [44, 13]
        ];

        var xyz = this.xyz_relatively(x, y, [0, -1, 0]);
        var xyzBad = this.xyz_relatively(x, y, [0, -2, 0]);

        this.set_block_array(xyz, dataset[this.random_int(0, dataset.length)]);
        this.set_block_array(xyzBad, [7, 0]);
    };

    this.clear = function (x, y) {
        for (var i = -3; i < 10; i++)
        {
            this.set_block_array(this.xyz_relatively(x, y, [0, i, 0]), [0, 0]);
        }
    };

    this.initMap = function () {
        if (this.world == 0)
        {
            this.world = (org.bukkit.Bukkit.getPlayer("LewisJang")).world;
        }

        var entities = this.world.getEntities();

        for (var x = (this.size * -1); x <= this.size; x++)
        {
            for (var y = (this.size * -1); y <= this.size; y++)
            {
                this.clear(x, y);
                this.floor(x, y);

                if (Math.abs(x) == this.size || Math.abs(y) == this.size)
                {
                    this.wall(x, y, (Math.random() > 0.5));
                }
            }
        }

        for (var i = 0; i < 15; i++)
        {
            var xyz = this.random_location(8, this.size - 10, "y");

            this.cross(xyz[0], xyz[2]);
        }

        for (var i = 0; i < entities.length; i++)
        {
            var thisEntity = entities[i];

            try
            {
                // remove all entity (item on floor)
                if (thisEntity.getType() != org.bukkit.entity.EntityType.PLAYER)
                {
                    thisEntity.remove();
                }
            }
            catch (e) { }
        }
    };
};

exports.map = new ljMap();
