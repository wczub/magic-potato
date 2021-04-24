var secrets = require('./secrets.json'),
    emoji = require('./emojis.json'),
    log = require('log-to-file'),
    Discord = require('discord.js'),
    AsciiTable = require('ascii-table'),
    localStorage = require('node-localstorage').LocalStorage;

const lowfuel = require('./lowfuel'),
    empire = require('./empire');

var bot = new Discord.Client();
bot.login(secrets.token);


bot.on('ready', function () {
    console.log('Logged in as %s\n', bot.user);

});

bot.on('message', async message => {

    if (message.author.bot) return;
    if (!message.guild) return;
    log(message.author.username + ': ' + message.content);
    if (message.guild.id === secrets.test) {
        lowfuel.logic(message);
    }
    if (message.guild.id == secrets.lowfuel) {
        lowfuel.logic(message);
    }
});

bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    let newUserChannel = newMember.channel;
    let oldUserChannel = oldMember.channel;
    if (newMember.member.user.bot) return;
    if (newMember.guild.id != secrets.lowfuel && newMember.guild.id != secrets.test)
        return;

    if (oldUserChannel === null && newUserChannel !== null) {
        var user = secrets.sounds.find(x => x.name === newMember.member.user.username)
        const connection = await newUserChannel.join();
        const dispatcher = connection.play(user.link, { volume: user.volume });

        dispatcher.on('finish', () => {
            newUserChannel.leave();
        });
        
        dispatcher.on('error', () => {
            console.error;
            newUserChannel.leave();
        })

    } 
})