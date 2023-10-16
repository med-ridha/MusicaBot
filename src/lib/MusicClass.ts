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
import { PaginatedResponse, Video } from "popyt";
import { createDiscordJSAdapter } from '../adapter';

import ytdl from "ytdl-core";

export class MusicClass {
    readonly player: AudioPlayer;
    queue: Video[];
    currentlyPlaying: Video | null;
    connection: VoiceConnection | null;
    currentPlayingMessage: Message | null;
    messageQueue: Message[];
    constructor() {
        this.player = new AudioPlayer;
        this.queue = [];
        this.currentlyPlaying = null;
        this.connection = null;
        this.currentPlayingMessage = null;
        this.messageQueue = [];
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

    async connect(message: Message) {
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
        try {
            this.player.play(resource);
        } catch (error) {
            console.error(error)
        }


        return entersState(this.player, AudioPlayerStatus.Playing, 50000);
    }
    async Queued(message: Message, song: Video): Promise<void | Message<boolean>> {
        return message.reply(`Queued: ${song.title}`)
            .catch((error) => { console.error(`ya ltif ${error}`) });
    }
    async playing(message: Message, song: Video): Promise<void | Message<boolean>> {
        return message.reply(`Playing: ${song.title}`)
            .catch(error => { console.error(`ya ltif ${error}`) });
    }
    printQueue() {
        this.queue.map(song => console.log(`URL: ${song.url}, TITLE: ${song.title}`));
    }
    async playSong(message: Message, servers: any): Promise<AudioPlayer> {
        if (this.currentPlayingMessage != null) {
            try {
                await this.currentPlayingMessage.delete();
            } catch (error) {
                console.error(error);
            }

        };
        this.prepareSong(this.queue[0].url);
        this.currentlyPlaying = this.queue[0];
        this.currentPlayingMessage = await this.playing(message, this.queue[0]) || null;
        this.queue.shift();
        const callback = async () => {
            if (this.player.state.status === AudioPlayerStatus.Idle) {
                if (this.currentPlayingMessage != null) {
                    try {
                        await this.currentPlayingMessage.delete();
                    } catch (error) {
                        console.error(error);
                    }
                };
                if (this.queue[0]) {
                    this.currentlyPlaying = this.queue[0];
                    if (this.messageQueue[0]) {
                        try {
                            await this.messageQueue[0].delete();
                            this.messageQueue.shift();
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    this.currentPlayingMessage = await this.playing(message, this.queue[0]) || null;
                    this.playSong(message, servers);
                    this.player.removeListener('stateChange', callback);
                } else {
                    message.reply('ma3adach fama songs fil queue, Hani 5arej').catch(error => { console.error(`ya ltif ${error}`) });
                    this.player.removeListener('stateChange', callback);
                    try {
                        this.player.stop();
                        this.connection!.destroy()
                        servers[message.guild!.id] = null;

                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        return this.player.on('stateChange', callback);
    }
    async play(message: Message, song: Video, servers: any): Promise<Number | Promise<AudioPlayer>> {
        if (this.connection?.state.status !== VoiceConnectionStatus.Ready) {
            this.connect(message);
        }
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.queue.push(song);
            let temp = await this.Queued(message, song);
            if (temp == null) {
                console.error("something went wrong");
            } else {
                this.messageQueue.push(temp);
            }
            return 0;
        } else {
            this.queue = [];
            this.queue.push(song);
            return this.playSong(message, servers);
        }
    }

    playList(message: Message, videos: PaginatedResponse<Video>, servers: any): Number | Promise<AudioPlayer> {
        if (this.connection?.state.status !== VoiceConnectionStatus.Ready) {
            this.connect(message);
        }
        videos.items.map(video => this.queue.push(video))
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            message.reply(`Queued Playlist`);
            return 0;
        }
        else {
            this.playing(message, this.queue[0]);
            return this.playSong(message, servers);
        }

    }

    stop() {
        try {
            this.player.stop();
            this.connection!.destroy();

        } catch (error) {
            console.error(error);
        }
    }
    skip(skipAmount?: number) {
        try {
            if (skipAmount) {
                this.queue.splice(0, skipAmount);
            }
            return this.player.stop(true);
        } catch (error) {
            console.error(error);
        }

    }
    resume() {
        try {
            return this.player.unpause();
        } catch (error) {
            console.error(error);
        }
    }
    pause() {
        try {
            return this.player.pause(true);
        } catch (error) {
            console.error(error);
        }
    }
}
