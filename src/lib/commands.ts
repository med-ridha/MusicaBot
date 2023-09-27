import { Message, VoiceBasedChannel } from "discord.js";
import { play, stop, skip, resume, pause } from "./music";

export function handleCommands(message: Message, content: string, channel: VoiceBasedChannel) {
    content = content.substring(1,);
    let args = content.split(" ");
    let command = args.shift();
    let songname = args.join(" ");

    switch (command) {
        case "7ot":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                play(message, songname)
            } catch (error) {
                console.error(error);
            }
            break;
        case "o5rej":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                stop(message);
            } catch (error) {
                console.error(error)
            }
            break;
        case "3adi":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                skip(message);
            } catch (error) {
                console.log(error);
            }
            break;
        case "a9ef":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                pause(message);
            } catch (error) {
                console.log(error);
            }
            break;
        case "kamel":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                resume(message);
            } catch (error) {
                console.log(error);
            }
            break;
    }
}
