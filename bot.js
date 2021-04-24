var secrets = require('./secrets.json'),
    emoji = require('./emojis.json'),
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

bot.on('message', message => {

    if (!message.guild) return;
    if (message.guild.id === secrets.test) {
        lowfuel.logic(message);
    }
    if (message.guild.id == secrets.lowfuel){
        lowfuel.logic(message);
    }  
});