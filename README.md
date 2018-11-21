# voidbot
A general-purpose Discord bot with basic features, built with discord.js and nodejs.


# setup
You will need nodejs and discord.js, find install instructions at https://nodejs.org and https://discord.js.org

You will need to create a Discord application and make it a bot. Find instructions at https://discordpy.readthedocs.io/en/rewrite/discord.html

Open and edit bot.js to customize to your liking. Search for "###" to find hotspots to edit.
Open auth.json and edit in your bot's token, otherwise the bot won't be able to login.

Run the bot with `node /path/to/bot.js`

# automation

Included are two scripts that can be edited and moved to /usr/bin and chmodded to allow automation of the bot.

voidconsole - A very simple console to check if the bot is running, start the bot, and stop the bot. Paths will need to be edited in the file.

voidcheck - A script that checks if the bot is running and start it if it isn't. Useful when combined with a cron job to make sure the bot doesn't die for an extended period of time. 
