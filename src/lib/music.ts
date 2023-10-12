import { Message } from "discord.js";

import { YouTube } from 'popyt';
import { MusicClass } from './MusicClass'
const search = new YouTube(process.env.YoutubeAPIKEY);
let servers: Record<string, MusicClass | null> = {};

export async function play(message: Message, songname: string): Promise<Number> {
    if (!servers[message.guild!.id]) servers[message.guild!.id] = new MusicClass();
    console.log(servers);
    let client = servers[message.guild!.id];

    if (songname.includes("https://www.youtube.com/")) {
        if (songname.includes("list")) {
            //getPlaylist(message, songname);
        } else {

        }
    } else {
        let song = await search.getVideo(songname).catch(error => console.error(error));
        if (!song) {
            message.reply("Ma9itech el song eli t7eb 3liha")
            return 1;
        }
        client!.play(message, song)
    }


    return 0;
}

export async function stop(message: Message) {
    if (!servers[message.guild!.id]) {
        return;
    }
    try {
        servers[message.guild!.id]!.stop();
        delete servers[message.guild!.id];
    } catch (error) {
        console.error(error);
    }
}

export function skip(message: Message) {
    if (!servers[message.guild!.id]) {
        return;
    }
    try {
        servers[message.guild!.id]!.skip();
    } catch (error) {
        console.error(error);
    }
}

export function resume(message: Message) {
    if (!servers[message.guild!.id]) {
        return;
    }
    try {
        servers[message.guild!.id]!.resume();
    } catch (error) {
        console.error(error);
    }
}
export function pause(message: Message) {
    if (!servers[message.guild!.id]) {
        return;
    }
    try {
        servers[message.guild!.id]!.pause();
    } catch (error) {
        console.error(error);
    }
}
