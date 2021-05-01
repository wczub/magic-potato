var emoji = require("./emojis.json"),
    log = require('log-to-file');
const discord = require('discord.js');

module.exports = {
    logic(message) {
        logg('poll: ' + message.content);
        if (message.content.toLowerCase() === '!poll help') {
            message.channel.send('Poll sizes should be between 2 and 20.\n' +
                'Format: !poll *The thing being polled* | *option 1*' +
                ' | *option 2* | *option 3* etc...');
            return;
        }
        var args = message.content.substring(5).split('|')
        if (args.length < 3 || args.length > 21) {
            message.channel.send('Error: Poll size. For help use **!help poll**')
            return;
        }
        var mentioned = args[0].search(/<@&?!?\d{18}>/);
        var question = args[0].replace(/<@&?!?\d{18}>/, '');

        embed = new discord.MessageEmbed();
        embed.setTitle(question);
        args.splice(0, 1);
        var description = '';

        for (let i = 0; i < args.length; i++) {
            description += emoji.letters[i] + ' ' + args[i] + '\n';
        }

        embed.setDescription(description);
        logg('sent embeded message');
        message.channel.send(embed)
            .then(newMessage => {
                for (let i = 0; i < args.length; i++) {
                    newMessage.react(emoji.letters[i])
                        .catch();
                }
            })
            .catch(function () {
                logg('failed poll: ' + message.content);
            });

        //message.delete().catch(err => logg('error on delete: ' + err));
        //logg('deleted message');
    }
}


function logg(msg) {
    log(msg, 'poll.log');
}