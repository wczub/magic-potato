var emoji = require("./emojis.json"),
    log = require('log-to-file'),
    poll = require('./poll');
const discord = require('discord.js');

module.exports = {
    logic(message) {
        var reaction;
        var reacting = false;
        var messaging = true;
        var response = '';

        try {
            if (message.content.startsWith('!') || message.content.startsWith('/')) {
                log(message.author.username + ' ' + message.content + ' ');

                var args = message.content.substring(1).split(' '),
                    cmd = args[0].toLowerCase();

                switch (cmd) {
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