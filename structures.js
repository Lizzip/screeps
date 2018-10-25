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
            },
            { type: STRUCTURE_STORAGE, loc: [] }
        ],
        "W2N7": [{
                type: STRUCTURE_SPAWN,
                name: "Spawnzilla_2",
                loc: [
                    [16, 38]
                ]
            },
            { type: STRUCTURE_TOWER, loc: [] },
            {
                type: STRUCTURE_WALL,
                loc: [
                    [13, 39],
                    [13, 40],
                    [13, 41],
                    [13, 42],
                    [13, 43],
                    [16, 36],
                    [17, 36],
                    [18, 36],
                    [19, 36]
                ]
            },
            { type: STRUCTURE_EXTENSION, loc: [] },
            { type: STRUCTURE_CONTAINER, loc: [] },
            { type: STRUCTURE_RAMPART, loc: [] },
            { type: STRUCTURE_STORAGE, loc: [] },
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