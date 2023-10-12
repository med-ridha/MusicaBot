"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicClass = void 0;
const voice_1 = require("@discordjs/voice");
const adapter_1 = require("../adapter");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
class MusicClass {
    player;
    queue;
    currentlyPlaying;
    connection;
    constructor() {
        this.player = new voice_1.AudioPlayer;
        this.queue = [];
        this.currentlyPlaying = null;
        this.connection = null;
    }
    async connectToChannel(channel) {
        const connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: (0, adapter_1.createDiscordJSAdapter)(channel),
        });
        try {
            await (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Ready, 30_000);
            return connection;
        }
        catch (error) {
            connection.destroy();
            throw error;
        }
    }
    async connect(message) {
        this.connection = await this.connectToChannel(message.member?.voice.channel);
        this.connection.subscribe(this.player);
    }
    async prepareSong(songURL) {
        const resource = (0, voice_1.createAudioResource)((0, ytdl_core_1.default)(songURL, {
            filter: "audioonly",
            quality: "lowestaudio"
        }), {
            inputType: voice_1.StreamType.Arbitrary,
        });
        try {
            this.player.play(resource);
        }
        catch (error) {
            console.error(error);
        }
        return (0, voice_1.entersState)(this.player, voice_1.AudioPlayerStatus.Playing, 50000);
    }
    Queued(message, song) {
        return message.reply(`Queued: ${song.title}`);
    }
    playing(message, song) {
        return message.reply(`Playing: ${song.title}`);
    }
    printQueue() {
        this.queue.map(song => console.log(`URL: ${song.url}, TITLE: ${song.title}`));
    }
    playSong(message) {
        this.prepareSong(this.queue[0].url);
        this.currentlyPlaying = this.queue[0];
        this.printQueue();
        this.queue.shift();
        const callback = () => {
            if (this.player.state.status === voice_1.AudioPlayerStatus.Idle) {
                if (this.queue[0]) {
                    this.playing(message, this.queue[0]);
                    this.playSong(message);
                    this.player.removeListener('stateChange', callback);
                }
                else {
                    message.reply('ma3adach fama songs fil queue, Hani 5arej');
                    this.player.removeListener('stateChange', callback);
                    try {
                        this.player.stop();
                        this.connection.destroy();
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
        };
        return this.player.on('stateChange', callback);
    }
    play(message, song) {
        if (this.connection?.state.status !== voice_1.VoiceConnectionStatus.Ready) {
            this.connect(message);
        }
        if (this.player.state.status === voice_1.AudioPlayerStatus.Playing) {
            this.queue.push(song);
            this.printQueue();
            this.Queued(message, song);
            return 0;
        }
        else {
            this.queue = [];
            this.queue.push(song);
            this.playing(message, song);
            return this.playSong(message);
        }
    }
    stop() {
        try {
            this.player.stop();
            this.connection.destroy();
        }
        catch (error) {
            console.error(error);
        }
    }
    skip() {
        try {
            return this.player.stop(true);
        }
        catch (error) {
            console.log(error);
        }
    }
    resume() {
        try {
            return this.player.unpause();
        }
        catch (error) {
            console.error(error);
        }
    }
    pause() {
        try {
            return this.player.pause(true);
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.MusicClass = MusicClass;
