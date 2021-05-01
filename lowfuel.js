var emoji = require("./emojis.json"),
    log = require('log-to-file'),
    poll = require('./poll');
const discord = require('discord.js');

module.exports = {
    logic(message) {
        //console.log(message);
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
                    case 'test':
                        reacting = true;
                        reaction = emoji.A;
                        break;
                    case 't':
                        for (let i = 0; i < 11; i++) {
                            message.react(emoji.numbers[i]);
                        }
                        return;
                    case 'poll':
                        poll.logic(message);
                        break;
                    default:
                        return;
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