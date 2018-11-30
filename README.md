# // voidbot
A general-purpose Discord bot with basic features, built with discord.js and nodejs.


# // setup
You will need nodejs and discord.js, find install instructions at https://nodejs.org and https://discord.js.org

You will need to create a Discord application and make it a bot. Find instructions at https://discordpy.readthedocs.io/en/rewrite/discord.html

Open and edit bot.js to customize to your liking. Search for "###" to find hotspots to edit.
Open auth.json and edit in your bot's token, otherwise the bot won't be able to login.

Run the bot with `node /path/to/bot.js`

# // automation

Included are two scripts that can be edited and moved to /usr/bin and chmodded to allow automation of the bot.

voidconsole - A very simple console to check if the bot is running, start the bot, and stop the bot. Paths will need to be edited in the file.

voidcheck - A script that checks if the bot is running and start it if it isn't. Useful when combined with a cron job to make sure the bot doesn't die for an extended period of time. 

# // file_descriptions

`auth.json` - Contains your bot's auth token, make sure to change "<INSERT_YOUR_TOKEN_HERE>" to your bot's Token found at https://discordapp.com/developers/applications/ (under the Bot tab).

`bot.js` - The main file for the bot. Edit this to suit your needs following the instructions in the file and comments.

`voidcheck` - A shell script to check if a node process is running (via `pgrep node`) and start the bot if it's not running. Make sure to edit the path to your `bot.js`

`voidconsole` - A shell script to make managing the bot easier. If you plan on killing the bot using the console, be sure to run the console with superuser/root permissions. Edit the paths at the top of the script to point to your bot.

# // notes

This is being developed on and tested on Ubuntu 14.04.1 LTS, some things may need to be changed in the shell scripts if used on different distributions. 
