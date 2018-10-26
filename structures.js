const utils = require('utils');

const structures = {
    rooms: {
        "W1N7": [{
                type: STRUCTURE_SPAWN,
                name: "Spawnzilla_1",
                loc: [
                    [41, 36]
                ]
            },
            {
                type: STRUCTURE_TOWER,
                loc: [
                    [37, 37],
                    [33, 35]
                ]
            },
            {
                type: STRUCTURE_WALL,
                loc: [
                    [2, 28],
                    [2, 29],
                    [8, 35],
                    [9, 35],
                    [10, 35],
                    [16, 40],
                    [16, 41],
                    [16, 42],
                    [1, 44],
                    [2, 44],
                    [2, 43],
                    [2, 42],
                    [2, 41],
                    [2, 40],
                    [2, 39]
                ]
            },
            { type: STRUCTURE_EXTENSION, loc: [] },
            {
                type: STRUCTURE_CONTAINER,
                loc: [
                    [35, 31],
                    [15, 23],
                    [35, 30]
                ]
            },
            {
                type: STRUCTURE_RAMPART,
                loc: [
                    [16, 43],
                    [41, 36]
                ]
            },
            {
                type: STRUCTURE_STORAGE,
                loc: [
                    [35, 36]
                ]
            }
        ],
        "W2N7": [
			{
                type: STRUCTURE_SPAWN,
                name: "Spawnzilla_2",
                loc: [
                    [16, 38]
                ]
            },
            { type: STRUCTURE_TOWER, loc: [[14,38]] },
            {
                type: STRUCTURE_WALL,
                loc: [
					[4,37],
					[4,38],
					[4,39],
					[4,40],
					[4,41],
					[4,42],
					[4,43],
					[4,44],
					[5,4],
					[6,4],
					[7,4],
					[8,4],
					[9,4],
					[13,6],
					[14,6],
					[15,6],
					[16,6],
					[17,6],
					[18,6],
					[19,6],
					[20,6],
					[26,9],
					[27,9],
					[28,9],
					[36,10],
					[37,10],
					[38,10],
					[39,10],
					[40,10],
					[41,10],
					[42,10]
                ]
            },
            { type: STRUCTURE_EXTENSION, loc: [[13,39], [14,40], [15,41], [16,42], [12,40], [13,41], [14,42], [15,43], [12,42], [13,43]] },
            { type: STRUCTURE_CONTAINER, loc: [[18,39], [14,13]] },
            { type: STRUCTURE_RAMPART, loc: [[16,38], [14,38]] },
            { type: STRUCTURE_STORAGE, loc: [] }
        ]
    }
};

structures.buildMissingStructures = () => {
    const roomNames = Object.keys(structures.rooms);

    roomNames.forEach(r => {
        structures.rooms[r].forEach(s => {
            if (s.loc.length) {
                if (s.name) {
                    Game.rooms[r].createConstructionSite(s.loc[0][0], s.loc[0][1], s.type, s.name);
                } else {
                    s.loc.forEach(l => {
                        Game.rooms[r].createConstructionSite(l[0], l[1], s.type);
                    })
                }
            }
        });
    });
};

module.exports = structures;