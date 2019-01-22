const Discord = require('discord.js'); // Defualt API
const package = require('./package.json'); // Loads Bot info
var config = require('./config.json'); // Loads settings into key/value array
var quotes = require('./quotes.json'); // Loads file content and parses into key/value array
const bot = new Discord.Client();
const DEBUG = false;

bot.on('message', (message) => {

	bot.user.setPresence({ status: 'online', game: { name: 'V2.2 | ?help' } });
	
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    /**
     * Get the value of a given key from the quotes file
     * @param  string key The key to check for
     * @return string     If found returns value of key or false if not found
     */
    function fetch_quote (key) {
        // Load quote file
        quotes = require('./quotes.json');
        // Check if key has a value
        if (key in quotes) {
            // Return value
            return quotes[key];
        } else return false;
    }

    function add_quote (key, value) {
        var fs = require('fs');
        quotes[key] = value;
        fs.writeFile('./quotes.json', JSON.stringify(quotes), (err) => {
            if (err) return console.log(err);
            console.log('Quote added: ' + key + ' saying ' + value + ' by ' + message.author.username);
        });
    }

    function list_all_quotes (message) {
        var block = '';
        message.channel.send('List of quotes been sent by pm');
        message.author.send('--------------------------------------------\r\n  Listing all saved quotes: \r\n--------------------------------------------');
        var counter = 0;
        // Assemble and output quotes in blocks of ten
        for (var quote in quotes) {
            // Check if ten quotes have been added to the block
            if (counter == 20) {
                // Reset counter and move to next block
                counter = 0;
                // Output current block
                if (block !== '') message.author.send(block);
                    else console.log('Failed to assemble string!');
                block = '';    
            }
            block = block + quote + ' => ' +  quotes[quote] + '\r\n';
            counter++;
        }
        if (block !== '') message.author.send(block);
        if (DEBUG) console.log(quotes);
    }

    function remove_quote (key) {
        delete quotes[key];
        var fs = require('fs');
        fs.writeFile('./quotes.json', JSON.stringify(quotes), (err) => {
            if (err) return console.log(err);
            console.log('Quote removed: ' + key + ' by ' + message.author.username);
        });
    }

    /**
    * Fetch a random quote from an array of quotes
    * @param quotes The key => value array to select from
    * @return A random quote
    */
    function fetchRandom(quotes) {
        if (quotes == null) return false;
        var keys = Object.keys(quotes);
        var available = Object.keys(quotes).length;
        var id = Math.floor(Math.random() * available);
        return quotes[keys[id]];
    }

    /**
    * Sort the key=>value array alphabetically then save to the quotes file + create a backup file of the old files contents
    * @param arrayToSort The array you want to sort
    * @return key=>value array
    */
    function sortArray(arrayToSort) {

        var jsonKeys = Object.keys(arrayToSort);
        var sortedKeys = jsonKeys.sort();
        var output = {};

        // Sort through each key and associate its old value with its new position
        for (var i = 0; i < sortedKeys.length; i++) output[sortedKeys[i]] = arrayToSort[sortedKeys[i]];
        var fs = require("fs");

        // Create backup of old file
        fs.writeFile("quotes_old.json", JSON.stringify(arrayToSort, null, 4), (err) => {
            if (err) return console.log(err);
        });

        // Write new order of quotes
        fs.writeFile("quotes.json", JSON.stringify(output, null, 4), (err) => {
            if (err) return console.log(err);
            });
        return output;
    }
      
    if (message.content.startsWith(config.prefix)){   
        // List All Quotes
        if (message.content.toLowerCase() == config.prefix + 'list') list_all_quotes(message);

        // Shows Quote
        if (message.content.startsWith(config.prefix + 'quote')) {
                var givenQuote = message.content.split(' ');
                if (givenQuote.length == 2) {
                    if (fetch_quote(givenQuote[1]) != false) message.channel.send(fetch_quote(givenQuote[1]));
                }   
        }
        
        // Help Command
        if (message.content.toLowerCase() == config.prefix + 'help'){message.channel.send("To use this bot use `?` infornt of any command, to use a quote start with `?quote quotename` and a list all quotes run `?list` command")};

        // Information Command
        if(message.content.startsWith(config.prefix + "info"))message.channel.send("Creators: " + package.authors + " , " + "Version: " + package.version);
            
        // Commands Command
        if (message.content.toLowerCase() == config.prefix + 'commands'){message.channel.send("The following commands can be used with this bot. ```?add \n!commands \n?help \n?info \n?list \n?quote \n?remove \n?sorta \n?random```")};

        // Random Quote
        if (message.content.toLowerCase() == config.prefix + 'random'){message.channel.send(fetchRandom(quotes))};
      
        
        // add_quote
        if (message.content.startsWith(config.prefix + 'add')) {
            if(message.member.roles.find("name", "Co-Owner") || message.member.roles.find("name", "Admins") || message.member.roles.find("name", "Mods") || (message.author.id == config.ownerID)){
                var givenQuote = message.content.split(' ');
                var finalQuote = '';
                if (givenQuote.length >= 3) {
                    if (givenQuote.length > 3) {
                        for (i = 2; i < givenQuote.length; i++) {
                            finalQuote = finalQuote + givenQuote[i] + ' ';
                        }
                        add_quote(givenQuote[1], finalQuote);
                        message.channel.send('Quote added successfully');
                    } else {
                        add_quote(givenQuote[1], givenQuote[2]);
                        message.channel.send('Quote added successfully');
                    }
                }
            }else message.channel.send(config.nopermissionerror);
        }

        // remove_quote
        if (message.content.startsWith(config.prefix + 'remove')) {
            if(message.member.roles.find("name", "Co-Owner") || message.member.roles.find("name", "Admins") || message.member.roles.find("name", "Mods") || (message.author.id == config.ownerID)){
            var givenQuote = message.content.split(' ');
                if (givenQuote.length == 2) {
                    if (fetch_quote(givenQuote[1]) != false) remove_quote(givenQuote[1]);
                    message.channel.send('Quote removed successfully');
                }     
            }else message.channel.send(config.nopermissionerror);
        }

        // Sortas All Quotes
        if (message.content.toLowerCase() == config.prefix + 'sorta') {
            if(message.member.roles.find("name", "Co-Owner") || message.member.roles.find("name", "Admins") || message.member.roles.find("name", "Mods") || (message.author.id == config.ownerID)){
                    quotes = sortArray(quotes);           
                    message.channel.send("Quotes Sortaed")
            }else message.channel.send(config.nopermissionerror);

        }// <- End of locked commands
    }

}); // End of bot.on

bot.on('ready', () => {
    console.log('I am ready!');
});

// Loads API Token
bot.login(config.token);
