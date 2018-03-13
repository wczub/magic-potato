var Discord = require('discord.io'),
    auth = require('./auth.json');
    

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

var users = [],
    commands =  'help: Returns all of the commands possible.\n' +
                'add <username>: Attaches a PUBG username to your discord account.\n' + 
                'remove <username>: Removes a PUBG username from your discord account.\n' + 
                'squad <option>: use command "!squad help" for a list of options',
    squadCommands = 'list: Displays a list of all squad members.\n' +
                    'add <usernames>: Adds up to 4 usernames (seperate by spaces). This uses your Discord Username.\n' +
                    'remove <username>: Removes username from squad. This uses your Discord Username.\n' +
                    'removeall: Removes everyone from the squad.\n';
function addUser(userName){
    users.push(userName);
    console.log(users);
    return true;
};

function removeUser(username){
    var index = users.indexOf(username);
    if (index > -1)
        users.splice(index, 1); 
    console.log(users);
    return true;
};

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function (user, userID, channelID, message, evt) {
    
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' '),
            cmd = args[0];
            
            switch(cmd) {
                case 'help':
                    response = commands
                    break;
                case 'add':
                    if (addUser(args[1])) {
                        response = 'Added PUBG user: ' + args[1]
                    } else {
                        response = 'Error adding user. Username is not a PUBG username.'
                    }
                    break;
                case 'remove': 
                    if (removeUser(args[1])){
                        response = 'Removed PUBG user: ' + args[1]
                    } else {
                        response = 'Error removing user. Username is case sensative.'
                    }
                    break;
                case 'squad':
                    var response = '';
                    if (args.length < 2)
                        response = 'Invalid use of !squad. Use "!squad options" for a list of options.\n';
                    var opt = args[1];
                    
                    if (opt == 'help'){
                        response = squadCommands;
                    } else if (opt == 'list') {
                        response = 'list command'
                    } else if (opt == 'add'){
                        response = 'add command';
                    } else if (opt == 'remove'){
                        response = 'remove command';
                    } else if (opt == 'removeall'){
                        response = 'removeAll command';
                    } else {
                        response = 'Invalid command. Use "!squad options" for a list of options.\n';
                    }
                    
                    break;
                default:
                    response = 'Invalid command. Use "!help" to get a list of commands.';
                    break;
            }
            bot.sendMessage({
                to: channelID,
                message: response
            });
    }
});