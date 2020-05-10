var Discord = require('discord.js'),
    log = require('log-to-file'),
    AsciiTable = require('ascii-table'),
    localStorage = require('node-localstorage').LocalStorage;

var bot = new Discord.Client();
bot.login(process.env.token);

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
    if (kills > prevKills) {
        storage.setItem(id, kills);
        return true;
    }
    return false;
}

bot.on('ready', function () {
    console.log('Logged in as %s\n', bot.user);

});

bot.on('message', message => {

    if (!message.guild) return;
    var emoji;
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
                case 'kills':
                    console.log(args.length);
                    if (args.length == 3) {
                        if (setKills(args[1], args[2]))
                            emoji = '✅';
                        else 
                            emoji = '❌';
                        reacting = true;
                        messaging = false;
                    } else {
                        emoji = '❌';
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
                message.react(emoji);
            }
            if (messaging && response != '') {
                message.channel.send(response);

            }
        }
    } catch {
        return;
    }
});