"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommands = void 0;
const music_1 = require("./music");
function handleCommands(message, content, channel) {
    content = content.substring(1);
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
                (0, music_1.play)(message, songname);
            }
            catch (error) {
                console.error(error);
            }
            break;
        case "o5rej":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                (0, music_1.stop)(message);
            }
            catch (error) {
                console.error(error);
            }
            break;
        case "3adi":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                (0, music_1.skip)(message);
            }
            catch (error) {
                console.log(error);
            }
            break;
        case "a9ef":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                (0, music_1.pause)(message);
            }
            catch (error) {
                console.log(error);
            }
            break;
        case "kamel":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                (0, music_1.resume)(message);
            }
            catch (error) {
                console.log(error);
            }
            break;
    }
}
exports.handleCommands = handleCommands;
