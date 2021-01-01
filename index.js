const Discord = require('discord.js');
const tmi = require('tmi.js');
const bot = new Discord.Client();
const prefix = "+";
count = 0;
discordChannel = null;
const playsong = require("./commands/songcommands.js");
bot.login(process.env.token);

bot.on('ready', () => {
    console.log("this Bot is ready");
    discordChannel = bot.channels.cache.get('744955015642349607');


})

bot.on('message', function(message) {
    console.log(message.channel.messages.cache.last());
    count++;
    var message2 = message.toString().replace(/\s+/g, ' ');
    let args = message2.substring(prefix.length).split(" ");
    if (args[1]) {
        if (args[1].toString().includes("https://www.youtube.com/")) {
            var songname = args[1];
        } else {
            var songname = message2.substring(args[0].length + 2, message.length);
        }
    }
    if (message2.substring(0, 1) === prefix) {
        if (message.channel.name === 'bot') {
            switch (args[0].toLowerCase()) {
                case 'count':
                    message.channel.send(count);
                    break;
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
                        }, {
                            name: 'ya39oubi',
                            value: '😂',
                        }, ],
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
                case 'ya39oubi':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room 9bal");
                        return;
                    }
                    playsong.ya39oubi(message);
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
})



const client = tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: process.env.username,
        password: process.env.oauth
    },
    channels: [process.env.channel]
});

client.connect().catch(console.error);
client.on('connected', () => {
    console.log('connected');
});
client.on('disconnected', () => {
    console.log('disconnected');
});

client.on('message', (channel, tags, message, self) => {
    if (self) {
        console.log(self);
        return;
    }
    if (tags.username.toLowerCase() === process.env.thank) {

        console.log(discordChannel.lastMessage.content);
        if (discordChannel.lastMessage.content !== 'done!!') {
            client.say(channel, `@${tags.username} thanks for the gifted sub I really appreciate it, sorry I missed it i went to sleep (this is an automated msg. I wrote this script to thank you if i couldn't make it to the stream, it can finally rest now)`);

            discordChannel.send('done!!');
        }
    }
});