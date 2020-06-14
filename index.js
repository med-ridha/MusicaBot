const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const search = require('yt-search');
var iamin;
var url;
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
    }, 5000)
}

function play(connection, message) {
    var server = servers[message.guild.id];

    dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));

    dispatcher.on("finish", () => {
        server.queue.shift();

        console.log(server);

        if (server.queue[0]) {
            message.channel.send('playing ' + server.queue[0]);
            play(connection, message);
        } else {
            message.channel.send('ma3adach fama songs fil queue, hani 5arej 3asba 3ala rasek');
            iamin = 'NO';
            message.guild.voice.connection.disconnect();
        }

    });
}
bot.on('message', message => {

    var message2 = message.toString().replace(/\s+/g, ' ');

    var songname;

    let args = message2.substring(prefix.length).split(" ");

    if (message2.substring(0, 1) === prefix) {
        if (message.channel.name === 'bot') {
            if (args[1]) {
                songname = message2.substring(args[0].length + 1, message.length);
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
                            message.channel.send('hani 5arej ya zebi! ');

                            message.guild.voice.connection.disconnect();

                        } else {

                            message.channel.send('da5el zebi fi room 9bal 3asba 3ala rasek!');
                        }
                    } catch (ex) {

                        message.channel.send('da5el zebi fi room 9bal 3asba 3ala rasek!');
                    }
                    break;
                case 'osket3asba':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room ya3ik 3asba!");
                        return;
                    }
                    var server = servers[message.guild.id];
                    try {
                        if (message.guild.voice.connection) {
                            if (dispatcher) dispatcher.end();
                        } else {
                            message.channel.send('ti zab manich 9a3ed na7ki');

                        }
                    } catch (ex) {
                        message.channel.send('ti zab manich 9a3ed na7ki');

                    }
                    break;

                case 'ping':
                    message.channel.send('Pong!');
                    break;
                case 'ya':
                    if (args[1].toUpperCase() === "ZARGA" || args[1].toUpperCase() === "RIDHA" || args[1].toUpperCase() === "RIRI") {
                        message.channel.send('ya ' + args[1] + ' ya zabour!');
                    } else {
                        message.channel.send('ya ' + args[1] + ' ya mnayek!');
                    }
                    break;
                case '7ot':


                    if (!args[1]) {
                        message.channel.send("zidha el  name 3asba");
                        return;
                    }
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room ya3ik 3asba!");
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

                    search(songname, function(err, r) {
                        console.log('+');
                        if (err) return message.channel.send('tnekna, tnekna ya zebi tnekna ! ');
                        message.channel.send('searching ' + songname);
                        let videos = r.videos;

                        try {
                            url = videos[0].url;
                            server.queue.push(url);
                            console.log(iamin);
                            if (iamin === 'yes') {
                                message.channel.send('Queued ' + videos[0].title);

                                return;
                            }
                            try {
                                if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                                    iamin = 'yes'
                                    message.channel.send('playing ' + videos[0].title);
                                    play(connection, message);
                                    console.log(server);
                                })
                            } catch (ex) { console.log(ex) }
                        } catch (ex) {

                            message.channel.send('mal9it 7ata 3asba ');
                        }
                    });




                    break;
                case 'osketla7dha':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room ya3ik 3asba!");
                        return;
                    }
                    try {
                        if (message.guild.voice.connection) {
                            if (dispatcher) dispatcher.pause(true);
                        } else {
                            message.channel.send('ti zab manich 9a3ed na7ki');

                        }
                    } catch (ex) {
                        message.channel.send('ti zab manich 9a3ed na7ki');

                    }

                    break;

                case 'kamel':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room ya3ik 3asba!");
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
                    message.channel.send('mafhemt 7ata 3asba nayek!');
                    break;
            }
        } else {
            message.channel.send('fil room mta3 l bot ya3tik 3asba');
        }
    }


})

bot.login(process.env.token);
//