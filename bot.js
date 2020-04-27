var Discord = require('discord.js'),
    auth = require('./auth.json'),
    unirest = require('unirest'),
    AsciiTable = require('ascii-table')
localStorage = require('node-localstorage').LocalStorage;
const SCORE = 0;
const TIME = 1;

var bot = new Discord.Client();
bot.login(auth.token);

storage = new localStorage('./test');

var commands = 'help: Returns all of the commands possible.\n' +
    'shame <name>: Shames a person for gettin zero kills\n';

function addUser(id) {
    var item = [0, 1000]
    storage.setItem(id, item);
    return true;
};

function score() {
    response = '```\n';
    scoreBoard = new Array();
    storage._keys.forEach(person => {
        var item = new Object();
        item.score = getScoreOrTime(storage.getItem(person), SCORE);
        item.name = person;
        scoreBoard.push(item);
    });

    var table = new AsciiTable('The Shame')
    scoreBoard.sort(compare);
    scoreBoard.forEach(function (user) {
        table.addRow(user.name, user.score);
    })
    response += table.toString();
    response += '```';

    return response;
}

function compare(a, b) {
    let comparison = 0;
    if (a.score < b.score)
        comparison = 1;
    else if (a.score > b.score)
        comparison = -1;
    return comparison;
}

function getScoreOrTime(str, num) {
    return Number(str.split(',')[num]);
}

function addShame(id, newTime) {
    let shame = getScoreOrTime(storage.getItem(id), SCORE);
    let oldTime = getScoreOrTime(storage.getItem(id), TIME);
    if (newTime > oldTime + 120000)
        storage.setItem(id, [shame + 1, newTime]);
    else
        return false;
    return true;
}

function removeShame(id, num) {
    let shame = getScoreOrTime(storage.getItem(id), SCORE);
    let time = getScoreOrTime(storage.getItem(id), TIME);
    shame -= num;
    shame = shame < 0 ? 0 : shame;
    storage.setItem(id, [shame, time]);
}

function removeUser(id) {
    storage.removeItem(id)
    return true;
};

bot.on('ready', function () {
    console.log('Logged in as %s\n', bot.user);

});

bot.on('message', message => {

    if (!message.guild) return;
    //console.log(message);
    var emoji;
    var reacting = false;
    var messaging = true;
    var response = '';

    if (message.content.startsWith('!')) {
        var args = message.content.substring(1).split(' '),
            cmd = args[0].toLowerCase();

        switch (cmd) {
            case 'help':
                response = commands;
                break;

            case 'setup':
                if (message.author.username == 'DCSpud') {
                    if (addUser(args[1]))
                        emoji = '✅';
                    else
                        emoji = '❌';
                    reacting = true;
                    messaging = false;

                } else {
                    response = "You don't have permission to do this."
                }
                break;
            case 'reset':
                if (message.author.username == 'DCSpud') {
                    storage._keys.forEach(person => {
                        addUser(person);
                    });
                    response = score();
                } else {
                    response = "You don't have permission to do this."
                }
                break;
            case 'shame':
                if (addShame(args[1], message.createdTimestamp))
                    emoji = '✅';
                else
                    emoji = '❌';
                reacting = true;
                messaging = false;

                break;

            case 'unshame':
                if (message.author.username == 'DCSpud') {
                    removeShame(args[1], args[2]);
                    emoji = '✅';
                    reacting = true;
                    messaging = false;
                } else {
                    response = "You don't have permission to do this."
                }
                break;

                break;
            case 'score':
                response = score();
                break;
            default:
                response = 'Invalid command. Use "!help" to get a list of commands.';
                break;
        }
        if (reacting) {
            message.react(emoji);
        }
        if (messaging) {
            message.channel.send(response);

        }
    }
});