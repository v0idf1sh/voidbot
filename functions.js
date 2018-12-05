const { Client, RichEmbed } = require('discord.js');
const package = require('./package.json');
var Datastore = require('nedb');
var profiles = new Datastore({ filename: '/path/to/bot/profiles.db', autoload: true });

// Place your strings here. Each variable name is self explanatory.
var help = "";
var rules = "";

// Do not change or remove!
var verified = 0;

// Change to 0 to disable the troll/bot filter.
var filter = 1;

// Do not change unless you know how to work with Dates, this outputs a complete ISO-8601 formatted date, perfect for logs.
function timestamp() {
	date = new Date;
	dateString = date.toISOString();
	return dateString;
}

module.exports = {
	exRules: rules,
	exVerified: verified,
	exFilter: filter,

	// This is a duplicate of timestamp above, except this allows the external use of timestamp()
	timestamp: function () {
		date = new Date();
		dateString = date.toISOString();
		return dateString;
	},

	// Takes commands passed from bot.js and handles them. Add, remove, change at will.
	botCmd: function (command, arguments, message) {
		switch (command) {
			case 'roll':
				// Rolls a dice. Very similar to !random, but allows multiple draws at once.
				// Syntax: !roll <number of dice> <sides on dice>
				// Example: !roll 2 6 (Roll 2 6-sided dice aka 2d6)
				switch (arguments.length) {
					case 0:
						message.channel.send("Roll expects 2 arguments, How many dice and how many sides the dice have.");
						break;
					case 1:
						message.channel.send("Roll expects 2 arguments, How many dice and how many sides the dice have.");
						break;
					case 2:
						totalRoll = 0;
						rollString = "";
						numberOfDice = parseInt(arguments[0]);
						diceSides = parseInt(arguments[1]) + 1; // Adds one to account for Math.random's lack of inclusiveness
						for (i = 0; i < numberOfDice; i++) {
							diceRoll = Math.floor(Math.random() * diceSides);
							rollString = `${rollString}\nDice #${i + 1}: ${diceRoll}`;
							totalRoll = totalRoll + diceRoll;
						}
						message.channel.send(rollString);
						message.channel.send(`Total: ${totalRoll}`);
						break;
				}
				return '[I] Rolled Dice.';
				break;
			case 'random':
				switch (arguments.length) {
					case 0:
						message.channel.send('You must specify a maximum number.');
						break;
					case 1:
						randMax = arguments[0];
						rand = Math.floor(Math.random() * randMax);
						message.channel.send(rand);
						break;
					case 2:
						min = parseInt(arguments[0]);
						max = parseInt(arguments[1]);
						a = max - min + 1;
						b = Math.floor(Math.random() * a);
						c = b + min;
						message.channel.send(c);
						break;
				}
				return "[I] Generated random number.";
				break;
			case 'gif':
				var giphy = require('giphy-api')('B1SX3md8dP9ClBZj0rZo06Bh5zQ8JdQg');
				var searchString = arguments.join(' ');
				try {
					giphy.search(searchString, function (err, res) {
						var rand = Math.floor(Math.random() * 5);
						if (res.data[rand]) {	
							var gifURL = res.data[rand].url;
							var gifEmbedURL = res.data[rand].images.original.url;
							var gifTitle = res.data[rand].title;
		
							//console.log(RichEmbed);
							const embed = new RichEmbed();
							embed.file = gifEmbedURL;
							embed.title = gifTitle;
		
							message.channel.send(embed);
						} else {
							message.channel.send("No GIF found for "+searchString+".");
						}
					});
				}
				catch (err) {
					message.channel.send("No GIF found for ",searchString,".");
				}
				return "[I] GIF Requested.";
				break;
			case 'sticker':
				var giphy = require('giphy-api')('B1SX3md8dP9ClBZj0rZo06Bh5zQ8JdQg');
				var searchString = arguments.join(' ');
				try {
					giphy.search({
						api: 'stickers',
						q: searchString
					}, function (err, res) {
						var rand = Math.floor(Math.random() * 5);
						if (res.data[rand]) {
							var stickerURL = res.data[rand].url;
							var stickerEmbedURL = res.data[rand].images.original.url;
							var stickerTitle = res.data[rand].title;
		
							const embed = new RichEmbed();
							embed.file = stickerEmbedURL;
							embed.title = stickerTitle;
		
							message.channel.send(embed);
						} else {
							message.channel.send("No sticker found for "+searchString+".");
						}
					});
				}
				catch (err) {
					message.channel.send("No sticker found for ",searchString,".");
				}
				break;
			case 'help':
				message.channel.send(help);
				return "[I] Help Page Requested.";
				break;
			case 'ping':
				message.channel.send(`Pong!`);
				return "[I] Pinged.";
				break;
			case 'rules':
				message.channel.send(rules);
				return "[I] Rules Requested.";
				break;
			case 'profile':
				var outputText = "Default Text";
				switch (arguments[0]) {
					case 'new':
						// Create new profile unique to `message.author`
						var tmpArgs = arguments;
						var tmpMsg = message;
						profiles.findOne({userID: `${message.author}`}, function(err, doc) {
							if (doc) {
								console.log(`    : Cannot set new profile. One already exists.`);
								tmpMsg.channel.send('Cannot set new profile. One already exists. Please use !profile edit {new profile}');								
							} else {
								var profileText = tmpArgs.slice(1).join(' ');
								var profile = {userID: `${message.author}`, profile: `${profileText}`};
								profiles.insert(profile, function(err, doc) {
									console.log(`New Profile: ${doc.userID} : ${doc.profile}`);
									tmpMsg.channel.send(`New Profile: ${doc.userID} : ${doc.profile}`);
								});
							}
						})
						return "[I] New profile.";
						break;
					case 'delete':
						var tmpMsg = message;
						profiles.findOne({userID: `${message.author}`}, function(err, doc) {
							if (doc) {
								profiles.remove({userID: `${message.author}`}, function(err, numDeleted) {
									message.channel.send(`Profile deleted.`);
								})
							} else {
								message.channel.send(`There is no profile to delete.`);
							}
						});
						return "[I] Deleted profile.";
						break;
					case 'edit':
						// Edit the profile associated with `message.author`
						var tmpArgs = arguments;
						profileText = tmpArgs.slice(1).join(' ');
						var tmpMsg = message;
						profiles.findOne({userID: `${message.author}`}, function(err, doc) {
							if (doc) {
								profiles.update({_id: `${doc._id}`}, {$set: {profile: `${profileText}`}}, function(err, numReplaced) {
									message.channel.send(`Profile Updated.`);
								});
							} else {
								message.channel.send(`Error updating the profile.`);
							}
						});
						return "[I] Edited profile.";
						break;
					case 'view':
						// View message.author's profile
						profiles.findOne({userID: `${message.author}`}, function(err, doc) {
							if (doc) {
								message.channel.send(`${doc.userID}\'s Profile: ${doc.profile}`);
							} else {
								message.channel.send(`I was unable to find your profile.`);
							}
						});
						return "[I] Got self profile.";
						break;
				}
				return "[I] Profile::";
				break;
			case 'examine':
				// Get the profile of a mentioned user and send it.
				var mentionArray = message.mentions.users.array();
				var mentioned = `\<\@${mentionArray[0].id}\>`;
				profiles.findOne({userID: `${mentioned}`}, function(err, doc) {
					if (doc) {
						message.channel.send(`${doc.userID}\'s Profile: ${doc.profile}`);
					} else {
						message.channel.send(`${mentioned} does not have a profile.`);
					}
				});
				return "Got profile";
				break;
		}
	},
	botCmdAdmin: function (command, arguments, message) {
		if (message.member.highestRole.toString() === "<@PLACE_YOUR_GROUPS_ADMIN_ID_HERE>") {
			switch (command) {
				case 'filter':
					message.channel.send(`Filter Status: ${filter}`);
					break;
				case 'filteron':
					filter = 1;
					message.channel.send('Bot filter enabled.');
					console.log(`[${timestamp()}][I] Bot filter enabled.`);
					break;
				case 'filteroff':
					filter = 0;
					message.channel.send('Bot filter diabled.');
					console.log(`[${timestamp()}][I] Bot filter disabled.`);
					break;
				case 'getPID':
					break;
			}
		} else {
			message.channel.send(`Sorry, '+' commands are for Admins only.`);
		}

	}
};