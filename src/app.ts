require('dotenv').config();
import { Client, GatewayIntentBits } from 'discord.js';
import { play, stop } from './commands/music'

const token = process.env.DiscordAPIKEY;

let prefix = '+';

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
});

client.on('ready', async () => {
    console.log('Discord.js client is ready!');

});

client.on('messageCreate', async (message) => {
    if (!message.guild) return;

    const channel = message.member?.voice.channel;
    let content = message.content;
    if (content.substring(0, 1) === prefix) {
        content = content.substring(1,);
        let args = content.split(" ");
        let command = args.shift();
        let songname = args.join(" ");

        switch (command) {
            case "7ot":
                if (channel) {
                    try {
                        play(message, songname)
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    message.reply('Join a voice channel then try again!');
                }
                break;
            case "o5rej":
                if (channel) {
                    try {
                        stop(message);
                    } catch (error) {
                        console.error(error)
                    }

                } else {
                    message.reply('od5el lel voice w 3awed jareb')
                }

        }

    }
});

void client.login(token);
