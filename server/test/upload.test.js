const request = require('supertest');
const path = require('path');
const mongoose = require('mongoose');
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
    jest.setTimeout(300000); // 5 mins
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

    expect(games[0]).toMatchObject({
        players: [
            {
                _id: expect.anything(),
                playerId: daveId,
                character: {
                    id: 15,
                    colorId: 3
                }
            },
            {
                //_id: expect.any(mongoose.Schema.Types.ObjectId),
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
        //_id: expect.any(mongoose.Schema.Types.ObjectId),
    });
})

test('Should not be able to upload duplicate games', async () => {
    const response1 = await request(app).post('/games/upload')
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

    const games1 = await Game.find();
    expect(games1.length).toBe(1);

    // Shouldnt allow game with same name and same players
    const response2 = await request(app).post('/games/upload')
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
    .expect(500);

    const games2 = await Game.find();
    expect(games2.length).toBe(1);

    // Should allow game with same name and different players
    const response3 = await request(app).post('/games/upload')
    .field('players', JSON.stringify([
            {
                username: 'Mango',
                port: 1
            },
            {
                username: 'Donny',
                port: 4
            }
        ])).attach('files', path.join(__dirname, '/files/BTSsmash-Game_20190825T163930.slp'))
    //.expect(200);

    console.log(JSON.stringify(response3.error));

    const games3 = await Game.find();
    expect(games3.length).toBe(2);
})

