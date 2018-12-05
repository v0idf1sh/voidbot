const { Client, RichEmbed } = require('discord.js');
const client = new Client();
const auth = require('./auth.json');
const package = require('./package.json');
const _f = require('./functions.js');
var args;
var cmd;

// User Variables:
prefix = '!';
adminPrefix = '+';

// Function to automatically kick users who didn't verify with your chosen word.
// To disable this, change the variable 'filter' in functions.js to 0
function kickUnverified() {
	try {
		if (_f.exVerified === 0) {
			console.log(`[${_f.timestamp()}][I] User did not verify and has been kicked.`);
			newUser.send("You have been kicked from Texas ABDLs because you failed to read the rules and verify that you weren't a bot.");
			newUser.kick("Did not verify.");
			newUser = "";
			_f.exVerified = 0;
		} else if (_f.exVerified === 1) {
			console.log(`[${_f.timestamp()}][I] User verified and will not be kicked.`);
			newUser = "";
			_f.exVerified = 0;
		}
	}
	catch(err) {
		console.log(`[${_f.timestamp()}][E] ${err}`);
	}
}

client.on('ready', () => {
	console.log(`[${_f.timestamp()}][I] Voidbot online.`);
});

client.on('message', message => {
	// This checks if a message starts with the prefix or admin prefix (default: '!' or '/' respectively) set in the variables above.
	try {
		var firstChar = message.content.slice(0,1);
		switch (firstChar) {
			case prefix:
				// args takes all the text after the prefix ('!') and puts it into an array, with separate entries per word.
				// ex: !profile Hey this is my profile
				// args is ["profile", "Hey", "this", "is", "my", "profile"]
				args = message.content.slice(1).trim().split(/ +/g);
				// cmd pops out just the first entry in args (the command) to be passed to functions.js
				cmd = args.shift().toLowerCase();
				console.log(`[${_f.timestamp()}]${_f.botCmd(cmd, args, message)}`);
				break;
			case adminPrefix:
				args = message.content.slice(1).trim().split(/ +/g);
				cmd = args.shift().toLowerCase();
				_f.botCmdAdmin(cmd, args, message);
				break;
		}
	}
	catch (err) {
		console.log(`Error: ${err}`);
	}

	try {
		// This is the check for verification that corresponds to kickUnverified()
		if (typeof newUser !== 'undefined' && typeof message.member.id !== 'null') {
			if (message.member.id === newUser.id) {
				if (message.content.toLowerCase() === 'abdl') {
					console.log(`[${_f.timestamp()}][I] User verified.`);
					message.channel.send(newUser.user + ' is verified!');
					_f.exVerified = 1;
				}	
			}
		}
	}
	catch (err) {
		console.log(`[${_f.timestamp()}][E] Error checking message member ID.`);
	}
});

// This is the function that sends rules to the default channel and starts the timer for autokick via kickUnverified
client.on('guildMemberAdd', member => {
	console.log(`[${_f.timestamp()}][I] New member joined.`);
	newUser = member;
	const channel = member.guild.channels.find(ch => ch.name === 'general'); // change 'general' to the channel that your users see by default if youd like.
	if (!channel) return;
	channel.send(_f.exRules);
	console.log(`[${_f.timestamp()}][I] Sent rules to new member.`);

	if (_f.exFilter === 1) {
		setTimeout(kickUnverified, 300000);
	}
});

client.login(auth.token);