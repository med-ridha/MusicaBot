require('dotenv').config();
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    VoiceConnection,
} from '@discordjs/voice';
import { Client, VoiceBasedChannel, GatewayIntentBits } from 'discord.js';
import { createDiscordJSAdapter } from './adapter';
import { play, stop } from './commands/music'

//const { token } = require('../config.json') as { token: string };
const token = process.env.DiscordAPIKEY;

let prefix = '+';
let connection: VoiceConnection;

async function connectToChannel(channel: VoiceBasedChannel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: createDiscordJSAdapter(channel),
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

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
                connection = await connectToChannel(channel!);
                if (channel) {
                    try {
                        play(connection, message, songname)

                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    void message.reply('Join a voice channel then try again!');
                }
                break;
            case "o5rej":
                if (channel) {
                    try {
                        stop(connection);
                    }catch(error) {
                        console.error(error)
                    }

                }

        }

    }
});

void client.login(token);
