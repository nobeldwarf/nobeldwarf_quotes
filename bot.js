var fs = require('fs'); // Imports to allow folder made
const Discord = require('discord.js'); // Defualt API
const package = require('./package.json'); // Loads bot info
const botapi = require('./botapi.js'); // Load functions file
var config = require('./config.json'); // Loads settings into key/value array
var quotes_folder = __dirname + '/quotes/' // Set dfault location for Quotes files
var users_folder = __dirname + '/users/' // Set dfault location for Users files
const bot = new Discord.Client();
const DEBUG = false;

bot.on('message', (message) => {

    // Stops none commands be processed.
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    // Setup Folders for Users and Quotes
    if (message.content.toLowerCase() == config.prefix + 'start'){
        serverowner_id = message.guild.ownerID
        if(message.author.id == message.guild.ownerID){
            gotten_id = message.guild.id
            gotten_name = message.guild.name
            userspath = users_folder+gotten_id+'.txt'
            quotespath = quotes_folder+gotten_id+'.json'
            if (fs.existsSync(userspath)){
                console.log("User File Already Exists For: "+gotten_id)
                message.channel.send("User File Already Exists")
            } else {
                fs.writeFile(userspath, serverowner_id, function(err) {
                    if (err) return console.log(err)
                    console.log("User File Made For: "+gotten_id)
                    message.channel.send("User File Made")
                })
            }
            if (fs.existsSync(quotespath)){
                console.log("Quotes File Already Exists For: "+gotten_id)
                message.channel.send("Quotes File Already Exists")
            } else {var output = {};
                fs.writeFile(quotespath, JSON.stringify(output, null, 4), function(err) {
                    if (err) return console.log(err)
                    console.log("Quotes File Made For: "+gotten_id)
                    message.channel.send("Quotes File Made")
                })
            }
            message.channel.send("Bot Setup For Server ID "+gotten_name)
        }else message.channel.send(config.nopermissionerror);
    } 

    // Add Admin Permission To Server User File.
    if (message.content.toLowerCase() == config.prefix + 'permission'){
        serverowner_id = message.guild.ownerID
        if(message.author.id == message.guild.ownerID){
            gotten_id = message.guild.id
            userspath = users_folder+gotten_id+'.txt'
            
        }else message.channel.send(config.nopermissionerror);
    }

    // List All Quotes
    if (message.content.toLowerCase() == config.prefix + 'list'){
        gotten_id = message.guild.id
        gotten_name = message.guild.name
        quotespath = quotes_folder+gotten_id+'.json'
        var quotes = require(quotespath); // Loads file content and parses into key/value array
        botapi.list_all_quotes(message, quotes, gotten_name);
    }

    // Shows Quote
    if (message.content.startsWith(config.prefix + 'quote')) {
        gotten_id = message.guild.id
        quotespath = quotes_folder+gotten_id+'.json'
        var quotes = require(quotespath); // Loads file content and parses into key/value array
        var givenQuote = message.content.split(' ');
        if (givenQuote.length == 2) {
            if (botapi.fetch_quote(givenQuote[1], quotes) != false) message.channel.send(botapi.fetch_quote(givenQuote[1], quotes));
        }   
    }
              
    // add_quote
    if (message.content.startsWith(config.prefix + 'add')) {
        gotten_id = message.guild.id
        gotten_name = message.guild.name
        userspath = users_folder+gotten_id+'.txt'
        quotespath = quotes_folder+gotten_id+'.json'
        var quotes = require(quotespath); // Loads file content and parses into key/value array
        if((message.author.id == config.ownerID||config.coownerID)||(message.member.roles.cache.has(config.adminID,config.modID))){
            var givenQuote = message.content.split(' ');
            var finalQuote = '';
            if (givenQuote.length >= 3) {
                if (givenQuote.length > 3) {
                    for (i = 2; i < givenQuote.length; i++) {
                        finalQuote = finalQuote + givenQuote[i] + ' ';
                    }
                    botapi.add_quote(givenQuote[1], finalQuote, quotes, quotespath, gotten_name, message);
                    message.channel.send('Quote added successfully');
                } else {
                    botapi.add_quote(givenQuote[1], givenQuote[2], quotes, quotespath, gotten_name, message);
                    message.channel.send('Quote added successfully');
                }
            }
        }else message.channel.send(config.nopermissionerror);
    }

    // remove_quote
    if (message.content.startsWith(config.prefix + 'remove')) {
        gotten_id = message.guild.id
        gotten_name = message.guild.name
        quotespath = quotes_folder+gotten_id+'.json'
        var quotes = require(quotespath); // Loads file content and parses into key/value array
        if((message.author.id == config.ownerID||config.coownerID)||(message.member.roles.cache.has(config.adminID,config.modID))){
            var givenQuote = message.content.split(' ');
            if (givenQuote.length == 2)
                if (botapi.fetch_quote(givenQuote[1], quotes) != false) botapi.remove_quote(givenQuote[1], quotes, quotespath, message, gotten_name); message.channel.send('Quote removed successfully');
        }else message.channel.send(config.nopermissionerror);
    }

    // Sortas All Quotes
    if (message.content.toLowerCase() == config.prefix + 'sorta') {
        gotten_id = message.guild.id
        quotespath = quotes_folder+gotten_id+'.json'
        var quotes = require(quotespath); // Loads file content and parses into key/value array
        if((message.author.id == config.ownerID||config.coownerID)||(message.member.roles.cache.has(config.adminID,config.modID))){
            quotes = botapi.sortArray(quotes, quotespath);           
            message.channel.send("Quotes Sortaed")
        }else message.channel.send(config.nopermissionerror);
    }

    // Random Quote
    if (message.content.toLowerCase() == config.prefix + 'random'){
        gotten_id = message.guild.id
        quotespath = quotes_folder+gotten_id+'.json'
        var quotes = require(quotespath); // Loads file content and parses into key/value array
        message.channel.send(botapi.fetchRandom(quotes))
    };

    // Information Command
    if(message.content.startsWith(config.prefix + "info"))message.channel.send("Creators: " + package.authors + " , " + "Version: " + package.version);
            
    // Commands Command
    if (message.content.toLowerCase() == config.prefix + 'commands'){message.channel.send("The following commands can be used with this bot. ```?add \n?commands \n?help \n?info \n?list \n?quote \n?remove \n?sorta \n?random```")};
      
    // Hug Command
    if(message.content.startsWith(config.prefix + 'hug')){message.channel.send("(っ´▽｀)っ <@"+message.mentions.members.first()+"> ⊂(´・ω・｀⊂)");};

    // Test for Server ID
    if (message.content.toLowerCase() == config.prefix + 'server'){
        gotten_id = message.guild.id
        serverowner_id = message.guild.ownerID
        message.channel.send("Server ID: " + gotten_id)
        message.channel.send("Server Owner ID: " + serverowner_id)
    }

    // Permission Test Command
    if (message.content.toLowerCase() == config.prefix + 'test') {
        gotten_id = message.guild.id
        userspath = users_folder+gotten_id+'.txt'
        var roles_ids = fs.readFileSync(userspath).toString().split("\n");
        if((message.author.id == config.ownerID||config.coownerID)||(message.member.roles.cache.has(roles_ids))){
            message.channel.send("You have admin permission") 
        }else message.channel.send("You do not have admin permission");
        
    }
            
    // Help Command
    if (message.content.toLowerCase() == config.prefix + 'help')
        {message.channel.send({embed: {
            color: 3447003,
            author: {
                name: (bot.user.username+" Help Section") ,
                icon_url: bot.user.avatarURL
            },
            thumbnail: {url: 'https://cdn.pixabay.com/photo/2016/06/15/15/02/info-1459077_1280.png',},
            fields: [{
                name: "Bot Prefix",
                value: ("To use any command use the following prefix **"+config.prefix+"**")
            },
            {
                name: "How to call a quote",
                value: "To call any quote from the saved list do the following **"+config.prefix+"quote <name of quote>**"
            },
            {
                name: "List all commands",
                value: "To list all commands do the following **"+config.prefix+"list**"
            }
            ],
            timestamp: new Date(),
            footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
            }
        }})
    };

}); // End of bot.on

bot.on('ready', () => {
    // Send Info to log to confirm its on
    console.log(`Logged in as ${bot.user.tag}!`);
    console.log('I am ready!');

    // Set bot status to the following message
    bot.user.setActivity('V'+package.version+' | ?help');

});

// Loads API Token
bot.login(config.token);
