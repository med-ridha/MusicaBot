const Discord = require('discord.js');
const playsong = require("./commands/songcommands.js");
const bot = new Discord.Client();
const prefix = "+";
const express = require("express")

let app = express()

app.listen(process.env.PORT, ()=>{
    console.log("listening")
})

app.get('/', (req, res) => {
    res.send('<h1>hello</h1>')
})

app.get('/73c8c6d74f4ab58d9646d6dc907cc3a5.html', (req, res) => {
    res.sendFile('/73c8c6d74f4ab58d9646d6dc907cc3a5.html', { root: __dirname})
})
    
bot.login(process.env.token);

bot.on('ready', () => {
    console.log("this Bot is ready");

})

bot.on('message', function(message) {

    var formatedMessage = message.toString().replace(/\s+/g, ' ');
    let args = formatedMessage.substring(prefix.length).split(" ");
    if (args[1]) {
        if (args[1].toString().includes("https://www.youtube.com/")) {
          var songname = args[1];
        } else {
            var songname = formatedMessage.substring(args[0].length + 2, message.length);
        }
    }
    if (formatedMessage.substring(0, 1) === prefix) {
        if (message.channel.name === 'bot') {
            switch (args[0].toLowerCase()) {
                case 'help':
                    var help = {
                        color: 0x0099ff,
                        title: "commands",
                        fields: [{
                            name: '7ot [song name/song link/playlist link]',
                            value: 'play song / playlist',
                        }, {
                            name: 'o5rej',
                            value: 'kick the bot',
                        }, {
                            name: '3adi',
                            value: 'skips the current song'
                        }, {
                            name: '3awed',
                            value: 'places the current song in front of the queue',
                        }, {
                            name: 'a9ef/kamel',
                            value: 'pause/resume',
                        }, {
                            name: 'info [song name]',
                            value: 'shows info about current song/ + song name : shows info about that song',
                        }, {
                            name: '5arej x/all',
                            value: 'remove the song at position x or delete the entire queue',
                        }, {
                            name: 'queue',
                            value: 'shows the queue',
                        } ],
                    }
                    message.channel.send({ embed: help });
                    break;
                case '7ot':
                    if (!args[1]) {
                        message.channel.send("zid esm el song wela el link")
                        return;
                    }
                    if (!message.member.voice.channel) {
                        message.channel.send("lazmek tod5ol el room 9bal");
                        return;
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
                case 'info':
                    playsong.info(message, songname);
                    break;
                case '5arej':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    if (!isNaN(args[1]) || args[1].toLowerCase() === 'all') {
                        playsong.kharej(message, args[1]);
                    } else {
                        message.channel.send(args[1] + " is not a number");
                    }
                    break;
                case 'queue':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    playsong.queue(message);
                    break;
            }
        }
    }


});
