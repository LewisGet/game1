ljMap = function () {
    this.world = 0;
    this.center = [41.5, 4, -553.5];
    this.size = [30, 30];

    this.set_block = function (xyz, typeId, data) {
        var location = new org.bukkit.Location(this.world, xyz[0], xyz[1], xyz[2]);

        location.block.setTypeId(typeId);
        location.block.setData(data);
    };

    this.xyz_relatively = function (x, y, xyz) {
        return [xyz[0] + x + this.center[0], xyz[1] + this.center[1], xyz[2] + y + this.center[2]];
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
            console.log(xyz);
        }
    };
};

exports.map = new ljMap();
