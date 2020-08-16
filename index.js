const Discord = require('discord.js');
const bot = new Discord.Client();
const solenolyrics = require("solenolyrics");
const ytdl = require('ytdl-core');
const { YouTube } = require('popyt');
const search = new YouTube(process.env.apiKey);
var iamin;
const prefix = '+';
var servers = {};
bot.on('ready', () => {
    console.log('this bot is online');
})

function sendMessage(message, msg) {
    message.channel.startTyping();
    setTimeout(() => {
        message.channel.send(msg).then((message) => {
            message.channel.stopTyping();
        });
    }, 3000)
}

async function searchsong(message, x) {
    let b = await search.getVideo(x);
    message.channel.send('Searching lyrics for ' + b.title);
    var lyrics = (async() => await solenolyrics.requestLyricsFor(b.title))();

    lyrics.then(function(result) {
        while (result) {
            message.channel.send(result.substring(0, 2000));
            result = result.substring(2000);
        }
    })
}

async function searchsongurl(message, x) {
    let b = await search.getVideo(x);
    message.channel.send('playing ' + b.title);
}

function play(connection, message) {
    connection.voice.setSelfDeaf(true);
    var server = servers[message.guild.id];
    dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));
    dispatcher.on("finish", () => {
        server.queue.shift();
        console.log(server);

        if (server.queue[0]) {
            searchsongurl(message, server.queue[0]);
            play(connection, message);
        } else {
            sendMessage(message, "ma3adach fama songs fil queue, hani 5rajet 3asba 3ala rasek");
            //message.channel.send('ma3adach fama songs fil queue, hani 5arej 3asba 3ala rasek');
            iamin = 'NO';
            message.guild.voice.connection.disconnect();
        }

    });
}

async function searchsong(message, songname) {
    var server = servers[message.guild.id];
    let r = await search.getVideo(songname);
    console.log(songname);
    message.channel.send('searching ' + songname);
    try {

        server.queue.push(r.url);
        console.log(iamin);
        if (iamin === 'yes') {
            message.channel.send('Queued ' + r.title);

            return;
        }
        try {
            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                iamin = 'yes'
                message.channel.send('playing ' + r.title);
                play(connection, message);
                console.log(server);
            })
        } catch (ex) { console.log(ex) }
    } catch (ex) {
        sendMessage(message, "mal9it 7ata 3asba ");
        // message.channel.send('mal9it 7ata 3asba ');
    }
}
bot.on('message', message => {

    var message2 = message.toString().replace(/\s+/g, ' ');

    var songname;

    let args = message2.substring(prefix.length).split(" ");

    if (message2.substring(0, 1) === prefix) {
        if (message.channel.name === 'bot') {
            if (args[1] && args[0] === '7ot' || args[1] && args[0] === 'lyrics') {
                songname = message2.substring(args[0].length + 2, message.length);
            }
            switch (args[0]) {
                case 'o5rejnayek':
                    iamin = 'NO';
                    if (!message.member.voice.channel) {
                        sendMessage(message, "od5el el room ya3ik 3asba!");
                        //  message.channel.send("od5el el room ya3ik 3asba!");
                        return;
                    }
                    var server = servers[message.guild.id];

                    try {
                        if (message.guild.voice.connection) {
                            while (server.queue[0]) {
                                server.queue.shift();
                            }
                            sendMessage(message, "hani 5arej ya zebi! ");
                            //message.channel.send('hani 5arej ya zebi! ');

                            message.guild.voice.connection.disconnect();

                        } else {
                            sendMessage(message, "da5el zebi fi room 9bal 3asba 3ala rasek!");
                            //message.channel.send('da5el zebi fi room 9bal 3asba 3ala rasek!');
                        }
                    } catch (ex) {
                        sendMessage(message, "da5el zebi fi room 9bal 3asba 3ala rasek!");
                        //message.channel.send('da5el zebi fi room 9bal 3asba 3ala rasek!');
                    }
                    break;
                case 'osket3asba':
                    if (!message.member.voice.channel) {
                        sendMessage(message, "od5el el room ya3ik 3asba!");
                        //message.channel.send("od5el el room ya3ik 3asba!");
                        return;
                    }
                    var server = servers[message.guild.id];
                    try {
                        if (message.guild.voice.connection) {
                            if (dispatcher) dispatcher.end();
                        } else {
                            sendMessage(message, "ti zab manich 9a3ed na7ki");
                            //message.channel.send('ti zab manich 9a3ed na7ki');

                        }
                    } catch (ex) {
                        sendMessage(message, "ti zab manich 9a3ed na7ki");
                        //message.channel.send('ti zab manich 9a3ed na7ki');

                    }
                    break;

                case 'ping':
                    message.channel.send('Pong!');
                    break;
                case 'ya':
                    if (args[1].toUpperCase() === "ZARGA" || args[1].toUpperCase() === "RIDHA" || args[1].toUpperCase() === "RIRI" || args[1].toUpperCase() === "ZEMZEM" || args[1].toUpperCase() === "MOHAMED" || args[1].toUpperCase() === "MED" || args[1].toUpperCase() === "ZRIGA") {
                        message.channel.send('ya ' + args[1] + ' ya zabour!');
                    } else {
                        message.channel.send('ya ' + args[1] + ' ya mnayek!');
                    }
                    break;
                case '7ot':
                    if (!args[1]) {
                        sendMessage(message, "zidha el  name 3asba");
                        // message.channel.send("zidha el  name 3asba");
                        return;
                    }
                    if (!message.member.voice.channel) {
                        sendMessage(message, "od5el el room ya3ik 3asba!");
                        // message.channel.send("od5el el room ya3ik 3asba!");
                        return;
                    }
                    if (!servers[message.guild.id]) servers[message.guild.id] = {
                        queue: []
                    }
                    var server = servers[message.guild.id];
                    if (args[1].includes("https:")) {
                        if (iamin === 'yes') {
                            server.queue.push(args[1]);
                            console.log(server);
                            return;
                        } else {
                            server.queue.push(args[1]);
                            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                                iamin = 'yes'
                                message.channel.send('playing ' + server.queue[0]);
                                play(connection, message);
                                console.log(server);
                            })
                        }
                        return;
                    }
                    searchsong(message, songname);
                    break;

                case 'lyrics':
                    var server = servers[message.guild.id];
                    if (songname) {



                        var lyrics = (async() => await solenolyrics.requestLyricsFor(songname))();

                        lyrics.then(function(result) {
                            while (result) {
                                message.channel.send(result.substring(0, 2000));
                                result = result.substring(2000);
                            }
                        })
                    } else {
                        searchsong(message, server.queue[0]);
                    }
                    break;
                case 'osketla7dha':
                    if (!message.member.voice.channel) {
                        sendMessage(message, "od5el el room ya3ik 3asba!");

                        return;
                    }
                    try {
                        if (message.guild.voice.connection) {
                            if (dispatcher) dispatcher.pause(true);
                        } else {
                            sendMessage(message, "ti zab manich 9a3ed na7ki");


                        }
                    } catch (ex) {
                        sendMessage(message, "ti zab manich 9a3ed na7ki");


                    }

                    break;

                case 'kamel':
                    if (!message.member.voice.channel) {
                        sendMessage(message, "od5el el room ya3ik 3asba!");
                        return;
                    }
                    try {
                        if (message.guild.voice.connection) {
                            if (dispatcher) dispatcher.resume();
                        } else {
                            message.channel.send(':/');

                        }
                    } catch (ex) {
                        message.channel.send(':/');

                    }

                    break;
                case 'fixjoinerror':
                    iamin = 'NO';
                    if (!servers[message.guild.id]) servers[message.guild.id] = {
                        queue: []
                    }
                    var server = servers[message.guild.id];
                    while (server.queue[0]) {
                        server.queue.shift();
                    }
                    break;
                default:
                    sendMessage(message, "mafhemt 7ata 3asba nayek!");

                    break;
            }
        } else {
            sendMessage(message, "fil room mta3 l bot ya3tik 3asba");

        }
    }


})

bot.login(process.env.token);