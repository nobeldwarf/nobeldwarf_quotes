var fs = require('fs'); // Imports to allow folder made
const DEBUG = false;

/**
 * Get the value of a given key from the quotes file
 * @param  string key The key to check for
 * @return string     If found returns value of key or false if not found
 */
exports.fetch_quote = function fetch_quote(key, quotes) {
    // Check if key has a value
    if (key in quotes) {
        // Return value
        return quotes[key];
    } else return false;
}

exports.add_quote = function add_quote(key, value, quotes, quotespath, gotten_name, message) {
    quotes[key] = value;
    fs.writeFile(quotespath, JSON.stringify(quotes), (err) => {
        if (err) return console.log(err);
        console.log('Quote added: ' + key + ' saying ' + value + ' by ' + message.author.username + " on server " + gotten_name);
    });
}

exports.list_all_quotes = function list_all_quotes(message, quotes, gotten_name) {
    var block = '';
    message.channel.send('List of quotes been sent by pm');
    message.author.send('--------------------------------------------\r\n  Listing all saved quotes for '+gotten_name+': \r\n--------------------------------------------');
    var counter = 0;
    // Assemble and output quotes in blocks of ten
    for (var quote in quotes) {
        // Check if ten quotes have been added to the block
        if (counter == 15) {
            // Reset counter and move to next block
            counter = 0;
            // Output current block
            if (block !== '') message.author.send(block);
            else console.log('Failed to assemble string!');
            block = '';
        }
        block = block + quote + ' => ' + quotes[quote] + '\r\n';
        counter++;
    }
    if (block !== '') message.author.send(block);
    if (DEBUG) console.log(quotes);
}

exports.remove_quote = function remove_quote(key, quotes, quotespath, message, gotten_name) {
    delete quotes[key];
    fs.writeFile(quotespath, JSON.stringify(quotes), (err) => {
        if (err) return console.log(err);
        console.log('Quote removed: ' + key + ' by ' + message.author.username + " on server " + gotten_name);
    });
}

/**
* Fetch a random quote from an array of quotes
* @param quotes The key => value array to select from
* @return A random quote
*/
exports.fetchRandom = function fetchRandom(quotes) {
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
exports.sortArray = function sortArray(arrayToSort, quotespath) {

    var jsonKeys = Object.keys(arrayToSort);
    var sortedKeys = jsonKeys.sort();
    var output = {};

    // Sort through each key and associate its old value with its new position
    for (var i = 0; i < sortedKeys.length; i++) output[sortedKeys[i]] = arrayToSort[sortedKeys[i]];
    var fs = require("fs");

    // Create backup of old file
    fs.writeFile(quotespath + ".old", JSON.stringify(arrayToSort, null, 4), (err) => {
        if (err) return console.log(err);
    });

    // Write new order of quotes
    fs.writeFile(quotespath, JSON.stringify(output, null, 4), (err) => {
        if (err) return console.log(err);
    });
    return output;
}