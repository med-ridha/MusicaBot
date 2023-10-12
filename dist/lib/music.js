"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pause = exports.resume = exports.skip = exports.stop = exports.play = void 0;
const popyt_1 = require("popyt");
const MusicClass_1 = require("./MusicClass");
const search = new popyt_1.YouTube(process.env.YoutubeAPIKEY);
let servers = {};
async function play(message, songname) {
    if (!servers[message.guild.id])
        servers[message.guild.id] = new MusicClass_1.MusicClass();
    console.log(servers);
    let client = servers[message.guild.id];
    if (songname.includes("https://www.youtube.com/")) {
        if (songname.includes("list")) {
            //getPlaylist(message, songname);
        }
        else {
        }
    }
    else {
        let song = await search.getVideo(songname).catch(error => console.error(error));
        if (!song) {
            message.reply("Ma9itech el song eli t7eb 3liha");
            return 1;
        }
        client.play(message, song);
    }
    return 0;
}
exports.play = play;
async function stop(message) {
    if (!servers[message.guild.id]) {
        return;
    }
    try {
        servers[message.guild.id].stop();
        delete servers[message.guild.id];
    }
    catch (error) {
        console.error(error);
    }
}
exports.stop = stop;
function skip(message) {
    if (!servers[message.guild.id]) {
        return;
    }
    try {
        servers[message.guild.id].skip();
    }
    catch (error) {
        console.error(error);
    }
}
exports.skip = skip;
function resume(message) {
    if (!servers[message.guild.id]) {
        return;
    }
    try {
        servers[message.guild.id].resume();
    }
    catch (error) {
        console.error(error);
    }
}
exports.resume = resume;
function pause(message) {
    if (!servers[message.guild.id]) {
        return;
    }
    try {
        servers[message.guild.id].pause();
    }
    catch (error) {
        console.error(error);
    }
}
exports.pause = pause;
