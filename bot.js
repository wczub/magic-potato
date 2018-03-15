var Discord = require('discord.io'),
    auth = require('./auth.json'),
    unirest = require('unirest'),
    storage = require('node-persist');

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

storage.initSync({
    continuous: true
});

var commands =  'help: Returns all of the commands possible.\n' +
                'squad <option>: Use command "!squad help" for a list of options\n' + 
                'love <name> <name>: Finds out how compatible two people are.\n' +
                'pubg set <username>: Attaches your PUBG account to your Discord account.\n' +
                'pubg reset <username>: Removes your PUBG account from your Discord account.',
    squadCommands = 'list: Displays a list of all squad members.\n' +
                    'add <usernames>: Adds up to 4 usernames (seperate by spaces). This uses your Discord Username.\n' +
                    'remove <username>: Removes username from squad. This uses your Discord Username.\n' +
                    'removeall: Removes everyone from the squad.\n';
                    
var squad = [];
function addUser(id, userName){
    storage.setItemSync(id, userName);
    console.log(storage.getItemSync(id));
    console.log(storage.values());
    return true;
};

function removeUser(id){
    storage.removeItemSync(id)
    return true;
};

function love(fname, sname, id){
    unirest.get("https://love-calculator.p.mashape.com/getPercentage?fname=" + fname + "&sname=" + sname)
    .header("X-Mashape-Key", "bbf8SOZNlUmsh4OyTDx1u1cKEofXp1C4ESljsnLTTcOTyWkjKE")
    .header("Accept", "application/json")
    .end(function (result) {
        var loveResponse = "There is a " + result.body.percentage + " percent chance that " + result.body.fname + " and " + result.body.sname + " are compatible.\n" + result.body.result;
        bot.sendMessage({
            to: id,
            message: loveResponse
        });
    });
};

function squadAdd(channelID, args){
    for (var i = 0; i < args.length; i++){
        console.log(args[i]);
    }
};

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    
});

bot.on('message', function (user, userID, channelID, message, evt) {

    console.log(storage.values());
    console.log(user);

    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' '),
            cmd = args[0].toLowerCase(),
            spot = channelID;
            
            switch(cmd) {
                case 'help':
                    spot = userID;
                    response = commands;
                    break;
                case 'pubg':
                    var success, mode;
                    if (args.length == 2 || args.length == 3){
                        if (args[2] != null && args[1] == "set"){
                            success = addUser(userID, args[2]);
                            mode = "set";
                        } else if (args[1] == "reset") {
                            success = removeUser(userID);
                            mode = "reset";
                        } else {
                            response = 'Invalid use of command. Use "!help" for a list of commands';
                            break;
                        }
                        if (success)
                            response = 'Succesfully ' + mode + ' your PUBG account.';
                        else 
                            response = 'Failed to ' + mode + ' your PUBG account';
                    } else {
                        response = 'Invalid use of command. Use "!help" for a list of commands';
                    }
                    break;
                case 'squad':
                    var response = '';
                    if (args.length < 2){
                        response = 'Invalid use of !squad. Use "!squad options" for a list of options.\n';
                        break;
                    }
                    var opt = args[1];
                    
                    if (opt == 'help'){
                        response = squadCommands;
                    } else if (opt == 'list') {
                        response = 'list command'
                    } else if (opt == 'add'){
                        response = squadAdd(spot, [args.slice(2)]);
                    } else if (opt == 'remove'){
                        response = 'remove command';
                    } else if (opt == 'removeall'){
                        response = 'removeAll command';
                    } else {
                        response = 'Invalid command. Use "!squad options" for a list of options.\n';
                    }
                    
                    break;
                case 'love':
                    
                    if (args.length >= 3){
                        love(args[1], args[2], spot);
                    } else {
                        response = "Invalid use. Please enter two names with the command.";
                    }
                    
                    break;
                default:
                    response = 'Invalid command. Use "!help" to get a list of commands.';
                    break;
            }
            bot.sendMessage({
                to: spot,
                message: response
            });
    }
});