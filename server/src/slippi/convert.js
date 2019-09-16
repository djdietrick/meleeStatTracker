const {default: SlippiGame} = require('slp-parser-js');
let path = require('path');
const characters = require('slp-parser-js/dist/melee/characters');
const stages = require('slp-parser-js/dist/melee/stages');

const game = new SlippiGame(path.join(__dirname, "../../test/files/BTSsmash-Game_20190825T163930.slp"));

const settings = game.getSettings();
console.log("SETTINGS");
console.log(settings);

const metadata = game.getMetadata();
console.log("METADATA");
console.log(metadata);

const stats = game.getStats();
console.log("STATS");
console.log(stats);