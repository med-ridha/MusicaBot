"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const discord_js_1 = require("discord.js");
const commands_1 = require("./lib/commands");
const token = process.env.DiscordAPIKEY;
const prefix = '+';
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
});
client.on('ready', async () => {
    console.log('Discord.js client is ready!');
});
client.on('messageCreate', async (message) => {
    if (!message.guild)
        return;
    const channel = message.member?.voice.channel;
    let content = message.content;
    if (content.substring(0, 1) === prefix) {
        (0, commands_1.handleCommands)(message, content, channel);
    }
    return;
});
void client.login(token);
