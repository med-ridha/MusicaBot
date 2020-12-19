const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "+";
const playsong = require("./commands/songcommands.js");
bot.login(process.env.token);
bot.on('ready', () => {
    console.log("this Bot is ready");
})

bot.on('message', function(message) {
    var message2 = message.toString().replace(/\s+/g, ' ');
    let args = message2.substring(prefix.length).split(" ");
    if (message2.substring(0, 1) === prefix) {
        if (message.channel.name === 'bot') {
            switch (args[0].toLowerCase()) {
                case '7ot':
                    if (!args[1]) {
                        message.channel.send("zid esm el song wela el link")
                        return;
                    }
                    if (!message.member.voice.channel) {
                        message.channel.send("lazmek tod5ol el room 9bal");
                        return;
                    }
                    if (args[1].toString().includes("https://www.youtube.com/")) {
                        var songname = args[1];
                    } else {
                        var songname = message2.substring(args[0].length + 2, message.length);
                    }
                    playsong.play(message, songname);
                    break;
                case 'o5rej':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    playsong.o5rej(message);
                    break;
                case 'a9ef':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    playsong.a9ef(message);
                    break;
                case 'kamel':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    playsong.kamel(message);
                    break;
                case '3adi':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    playsong.aadi(message);
                    break;
                case '3awed':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    playsong.aawed(message);
                    break;
                case 'ya39oubi':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    playsong.ya39oubi(message);
                    break;

            }
        }
    }
})