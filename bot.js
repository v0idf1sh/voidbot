/*
* How to edit this file...
*  In your favorite text editor search for ###
*  All lines allowing/requiring customization will be ended with //###
*  Usually with a note included as to what you need to customize.
*/

const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const package = require('./package.json');

// User Defined Variables:
var help = "<YOUR_HELP_TEXT_HERE>"; //###
var rules = "<YOUR_RULES_HERE>"; //###
var newUser;
var verified = 0;
var filter = 1; // Set the bot filter on by default.

// Function to return a date-timestamp as a string for use in logging.
function timestamp() {
	date = new Date;
	var y = date.getFullYear();
	var M = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();

	var dateString = y.toString() + '-' + M.toString() + '-' + d.toString() + ' ' + h.toString() + ':' + m.toString() + ':' + s.toString();
	return dateString;
}

// Function to kick the new user if they haven't verified within 5 minutes.
function kickUnverified() {
	try {
		if (verified === 0) {
			console.log(`${timestamp()}> V: ${newUser.displayName} did not verify and has been kicked.`);
			newUser.send("<MESSAGE_TO_KICKED_USER>"); //###
			newUser.kick("<REASON_PUT_INTO_AUDIT_LOG>"); //###
			newUser = "";
			verified = 0;
		} else if (verified === 1) {
			console.log(`${timestamp()}> V: ${newUser.displayName} was verified and will not be kicked.`);
			newUser = "";
			verified = 0;
		}
	}
	catch(err) {
		console.error(`${timestamp()}> E: There was an issue with the kickUnverified function.`);
	}
}

client.on('ready', () => {
	console.log(`\n${timestamp()}> I: Voidbot online...`);
});

client.on('guildMemberAdd', member => {
	try {
		console.log(`${timestamp()}> V: ${member.displayName} has joined the server and had the rules sent to them.`);
		newUser = member;
		const channel = member.guild.channels.find(ch => ch.name === 'general');
		if (!channel) return;
		channel.send(rules);
	
		if (filter === 1) {
			// Change 300000 to the amount of time (in milliseconds) you want users to have to verify before being kicked.
			setTimeout(kickUnverified, 300000); //###
		}
	}
	catch (err) {
		console.log(`${timestamp()}> There was an error in the guildMemberAdd function, the new user was not welcomed and rules were not sent.`);
	}
	
});

// When a message is received by the bot in a channel it's in.
client.on('message', message => {
	// General Commands
	try {
		switch (message.content) {
			// ### Add and change commands here.
			case '!help':
				message.channel.send(help);
				console.log(timestamp() + '> V: Sent help text.');
				break;
			case '!ping':
				message.channel.send('Pong!');
				console.log(timestamp() + '> V: Responded to pong.');
				break;
			case '!rules':
				message.channel.send(rules);
				console.log(timestamp() + '> V: Sent rules.');
				break;
		}
	
		// Administrator Commands
		/* ###
		*  There are two ways to go about using the following block of code. You can use an accompanying script to get
		*  role IDs and replace "<ROLE_ID>" with the proper role ID to restrict the use of those commands to administrators
		*  -- OR --
		*  Remove lines 106, 131, 132, 133 (the if, else statement checking the role ID) and simply don't tell anyone about
		*  the commands. If you do this I recommend a separate channel that only the bot and admins can see to send these commands.
		*/
		if (message.content.charAt(0) === "/"){
			if (message.member.highestRole.toString() === "<ROLE_ID>") { //###
				switch (message.content) {
					case '/filter':
						switch (filter) {
							case 0:
								message.channel.send('The bot filter is currently off. To turn it on use \"/filteron\"');
								break;
							case 1:
								message.channel.send('The bot filter is currently on. To turn it off use \"/filteroff\"');
						}
						break;
					case '/filteron':
						filter = 1;
						message.channel.send('The bot filter is now enabled.');
						break;
					case '/filteroff':
						filter = 0;
						message.channel.send('The bot filter is now disabled.');
						break;
					case '/kill':
						message.channel.send('This will KILL the bot and the bot will be nonfunctional until the owner can restart it. Use this only if the bot is having severe issues. Type \"/sudokill\" to confirm.');
						break;
					case '/sudokill':
						throw '';
				}
			} else {
				message.channel.send("Sorry, \'/\' commands are for Administrators only.");
			}
		}
		
	
	
		try {
			if (typeof newUser !== 'undefined' && typeof message.member.id !== 'null') {
				if (message.member.id === newUser.id) {
					if (message.content === '<YOUR_VERIFICATION_WORD>' || message.content === '<VARIATION_OF_YOUR_VERIFICATION_WORD>') { //###
						console.log(`${timestamp()}> V: ${newUser.displayName} has been verified.`);
						message.channel.send(newUser.user + ' is verified!');
						verified = 1;
					}	
				}
				
			}	
		}
		catch(err) {
			console.log(`${timestamp()}> E: There was an error in the verification code.`);
		}
	}
	catch (err) {
		console.log(`${timestamp()}> E: There was a general error.`);
	}
});

client.login(auth.token);