import {
    AudioPlayer,
    AudioPlayerStatus,
    StreamType,
    VoiceConnection,
    VoiceConnectionStatus,
    createAudioResource,
    entersState,
    joinVoiceChannel
} from "@discordjs/voice";
import { Message, VoiceBasedChannel } from "discord.js";
import { Video } from "popyt";
import { createDiscordJSAdapter } from '../adapter';

import ytdl from "ytdl-core";

export class MusicClass {
    readonly player: AudioPlayer;
    queue: Video[];
    currentlyPlaying: Video | null;
    connection: VoiceConnection | null;
    constructor() {
        this.player = new AudioPlayer;
        this.queue = [];
        this.currentlyPlaying = null;
        this.connection = null;
    }
    async connectToChannel(channel: VoiceBasedChannel) {
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

    async connect(message: Message){
        this.connection = await this.connectToChannel(message.member?.voice.channel!);
        this.connection!.subscribe(this.player);
    }

    async prepareSong(songURL: string): Promise<AudioPlayer> {
        const resource = createAudioResource(
            ytdl(
                songURL,
                {
                    filter: "audioonly",
                    quality: "lowestaudio"
                }
            ), {
            inputType: StreamType.Arbitrary,
        });
        this.player.play(resource);


        return entersState(this.player, AudioPlayerStatus.Playing, 50000);
    }
    Queued(message: Message, song: Video): Promise<Message<boolean>> {
        return message.reply(`Queued: ${song.title}`);

    }
    playing(message: Message, song: Video): Promise<Message<boolean>> {
        return message.reply(`Playing: ${song.title}`);
    }
    printQueue() {
        this.queue.map(song => console.log(`URL: ${song.url}, TITLE: ${song.title}`));
    }
    playSong(message: Message): AudioPlayer {
        this.prepareSong(this.queue[0].url);
        this.currentlyPlaying = this.queue[0];
        this.printQueue();
        this.queue.shift();
        const callback = () => {
            if (this.player.state.status === AudioPlayerStatus.Idle) {
                if (this.queue[0]) {
                    this.playing(message, this.queue[0]);
                    this.playSong(message);
                    this.player.removeListener('stateChange', callback);
                } else {
                    message.reply('ma3adach fama songs fil queue, Hani 5arej');
                    this.player.removeListener('stateChange', callback);
                    try {
                        this.player.stop();
                        this.connection!.destroy()

                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        return this.player.on('stateChange', callback);
    }
    play(message: Message, song: Video): Number | AudioPlayer {
        if (this.connection?.state.status !== VoiceConnectionStatus.Ready){
            this.connect(message);
        }
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.queue.push(song);
            this.printQueue();
            this.Queued(message, song);
            return 0;
        } else {
            this.queue = [];
            this.queue.push(song);
            this.playing(message, song);
            return this.playSong(message);
        }
    }
    stop() {
        try {
            this.player.removeAllListeners();
            this.player.stop();
            this.connection!.destroy();

        }catch (error) {
            console.error(error);
        }
    }
}
