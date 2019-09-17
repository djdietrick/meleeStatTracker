const {default: SlippiGame} = require('slp-parser-js');
let path = require('path');
const characters = require('slp-parser-js/dist/melee/characters');
const stages = require('slp-parser-js/dist/melee/stages');

exports.convertFile = convertFile;

function convertFile(filename) {
    const game = new SlippiGame(path.join(__dirname, "./uploads/" + filename));

    const settings = game.getSettings();
    const metadata = game.getMetadata();
    const stats = game.getStats();

    let retGame = {};
    retGame.filename = filename;

    retGame.stage = {
        id: settings.stageId,
        name: stages.getStageName(settings.stageId)
    };

    retGame.players = [];
    settings.players.forEach((player) => {
        retGame.players.push({
            index: player.playerIndex,
            port: player.port,
            character: {
                id: player.characterId,
                name: characters.getCharacterName(player.characterId),
                colorId: player.characterColor,
                colorName: characters.getCharacterColorName(player.characterColor)
            },
            remainingStocks: 4,
            controllerFix: player.controllerFix,
            tag: player.nametag
        })
    });

    stats.stocks.forEach((stock) => {
        if(stock.deathAnimation) {
            retGame.players.find((player) => {
                return player.index === stock.playerIndex;
            }).remainingStocks -= 1;
        }     
    });

    // TODO, need to handle quit/sudden death scenario
    retGame.winner = retGame.players.find((player) => {
        return player.remainingStocks !== 0
    });

    return retGame;
}
