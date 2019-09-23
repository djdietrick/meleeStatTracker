const request = require('supertest');
const path = require('path');
const app = require('../src/app');
const {dave, tom, donny, daveId,
    tomId, donnyId, setupPlayers, deleteGames} = require('./fixtures/db');
const Player = require('../src/models/player');
const Game = require('../src/models/game');
const characters = require('../node_modules/slp-parser-js/dist/melee/characters');
const stages = require('../node_modules/slp-parser-js/dist/melee/stages');

beforeEach(async () => {
    await deleteGames();
    await setupPlayers();
});

test('Simple upload', async () => {
    const response = await request(app).post('/games/upload')
    .field('players', JSON.stringify([
            {
                username: 'Dave',
                port: 1
            },
            {
                username: 'Tom',
                port: 4
            }
        ])).attach('files', path.join(__dirname, '/files/BTSsmash-Game_20190825T163930.slp'))
    .expect(200);

    const games = await Game.find();
    expect(games.length).toBe(1);

    const expectedObject = {
        players: [
            {
                playerId: daveId,
                character: {
                    id: 15,
                    colorId: 3
                }
            },
            {
                playerId: tomId,
                character: {
                    id: 0,
                    colorId: 0
                }
            }
        ],
        stageId: 8,
        winnerPlayerId: daveId,
        filename:'BTSsmash-Game_20190825T163930.slp'
    }

    expect(games[0]).toMatchObject(expect.objectContaining({
        players: [
            {
                playerId: daveId,
                character: {
                    id: 15,
                    colorId: 3
                }
            },
            {
                playerId: tomId,
                character: {
                    id: 0,
                    colorId: 0
                }
            }
        ],
        stageId: 8,
        winnerPlayerId: daveId,
        filename:'BTSsmash-Game_20190825T163930.slp'
    }));
})

