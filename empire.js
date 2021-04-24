var emoji = require("./emojis.json"),
    log = require('log-to-file'),
    localStorage = require('node-localstorage').LocalStorage,
    AsciiTable = require('ascii-table');
const discord = require('discord.js');

storage = new localStorage('./top');

var commands = '**help**: Returns all of the commands possible.\n' +
    '**kills** *<name> <number>*: Records a person\'s top kills. Can\'t ne a lower number than already there\n' +
    '**score**: Shows the top kills\n';

function addUser(id) {
    storage.setItem(id, 0);
    return true;
};

function score() {
    response = '```\n';
    scoreBoard = new Array();
    storage._keys.forEach(person => {
        var item = new Object();
        item.score = storage.getItem(person);
        item.name = person;
        if (item.score > 0)
            scoreBoard.push(item);
    });

    var table = new AsciiTable('The Fame')
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
    var score1 = Number(a.score);
    var score2 = Number(b.score);
    if (score1 < score2)
        comparison = 1;
    else if (score1 > score2)
        comparison = -1;
    return comparison;
}

function setKills(id, kills) {
    var prevKills = storage.getItem(id)
    if (Number(kills) > Number(prevKills)) {
        storage.setItem(id, kills);
        return true;
    }
    return false;
}

module.exports = {
    logic(message) {
        var reaction;
        var reacting = false;
        var messaging = true;
        var response = '';

        try {
            if (message.content.startsWith('!')) {
                log(message.author.username + ' ' + message.content + ' ');

                var args = message.content.substring(1).split(' '),
                    cmd = args[0].toLowerCase();

                    switch (cmd) {
                    case 'help':
                        response = commands;
                        break;

                    case 'setup':
                        if (message.author.username == 'DCSpud') {
                            if (addUser(args[1]))
                                reaction = emoji.success;
                            else
                                reaction = emoji.failure;
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
                    case 'kills':
                        if (args.length == 3) {
                            if (setKills(args[1], args[2]))
                                reaction = emoji.success;
                            else
                                reaction = emoji.failure;
                            reacting = true;
                            messaging = false;
                        } else {
                            reaction = emoji.failure;
                            reacting = true;
                            messaging = false;
                        }

                        break;
                    case 'top':
                    case 'score':
                        response = score();
                        break;
                    default:
                        response = 'Invalid command. Use "!help" to get a list of commands.';
                        break;
                }
                if (reacting) {
                    message.react(reaction);
                }
                if (messaging && response != '') {
                    message.channel.send(response);

                }
            }
        } catch {
            return;
        }
    }
}