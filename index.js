const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const search = require('yt-search');

var url;
const prefix = '+';
var servers = {};
bot.on('ready', () => {
    console.log('this bot is online');
})

function play(connection, message) {
    var server = servers[message.guild.id];
    dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));

    dispatcher.on("finish", () => {
        server.queue.shift();
        console.log(server);
        if (server.queue[0]) {
            play(connection, message);
        } else {
            message.channel.send('ma3adach fama songs fil queue, hani 5arej 3asba 3ala rasek');
            message.guild.voice.connection.disconnect();
        }

    });
}
bot.on('message', message => {

    var message2 = message.toString().replace(/\s+/g, ' ');



    let args = message2.substring(prefix.length).split(" ");

    if (message2.substring(0, 1) === prefix) {
        if (message.channel.name === 'bot') {
            switch (args[0]) {
                case 'o5rejnayek':
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
                case 'zid':
                    if (!args[1]) {
                        message.channel.send("zidha el  name 3asba");
                        return;
                    }
                    var server = servers[message.guild.id];
                    search(message2.substring("+zid".length), function(err, r) {

                        if (err) message.channel.send('tnekna tnekna ya zebi tnekna ! ');
                        message.channel.send('searching ' + message2.substring("+zid".length));
                        let videos = r.videos.slice(0, 10);
                        /*for (var i in videos) {
                            console.log(videos[i].title + '\n');
                        }*/
                        try {
                            message.channel.send(' ' + videos[0].title);
                            message.channel.send(' ' + videos[0].url);
                            url = videos[0].url;
                            server.queue.push(url);
                            console.log(server);
                        } catch (ex) { message.channel.send('ma9it 7ata 3asba ya zebi !'); }
                    })

                    break;
                case 'od5elnayek':
                    var server = servers[message.guild.id];
                    try {
                        if (!message.guild.voice.connection) {
                            while (server.queue[0]) {
                                server.queue.shift();
                            }

                        } else {

                            message.channel.send('aya hani da5el');
                        }
                    } catch (ex) {

                        message.channel.send('tnekna ya zebi tnekna');
                    }

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

                    search(message2.substring("+od5elnayek".length), function(err, r) {

                        if (err) message.channel.send('tnekna, tnekna ya zebi tnekna ! ');
                        message.channel.send('searching ' + message2.substring("+od5elnayek".length));
                        let videos = r.videos.slice(0, 10);
                        for (var i in videos) {
                            console.log(videos[i].title + '\n');
                        }
                        try {

                            message.channel.send(' ' + videos[0].title);
                            message.channel.send(' ' + videos[0].url);
                            url = videos[0].url;
                            server.queue.push(url);

                            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {

                                play(connection, message);
                                console.log(server);
                            })
                        } catch (ex) { message.channel.send('ma9it 7ata 3asba ya zebi !'); }
                    });




                    break;
                case 'osketla7dha':

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