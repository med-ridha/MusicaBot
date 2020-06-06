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
            iamin = 'NO';
            message.guild.voice.connection.disconnect();
        }

    });
}
bot.on('message', message => {

    var message2 = message.toString().replace(/\s+/g, ' ');

    var songname;

    let args = message2.substring(prefix.length).split(" ");
    if (!message.member.voice.connection) {
        iamin = 'NO';
    }
    if (message2.substring(0, 1) === prefix) {
        if (message.channel.name === 'bot') {
            if (args[1]) {
                songname = message2.substring(args[0].length + 1, message.length);
            }
            switch (args[0]) {
                case 'o5rejnayek':
                    iamin = 'NO';
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room ya3ik 3asba!");
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
                case 'zid':
                    if (!message.member.voice.channel) {
                        message.channel.send("od5el el room ya3ik 3asba!");
                        return;
                    }
                    if (!args[1]) {
                        message.channel.send("zidha el  name 3asba");
                        return;
                    }
                    if (!servers[message.guild.id]) servers[message.guild.id] = {
                        queue: []
                    }
                    var server = servers[message.guild.id];
                    search(songname, function(err, r) {

                        if (err) message.channel.send('tnekna tnekna ya zebi tnekna ! ');
                        message.channel.send('searching ' + songname);
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
                        } catch (ex) { message.channel.send('something went wrong plz try again :  ' + ex); }
                    })

                    break;
                case 'od5elnayek':


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
                    /* while (server.queue[0]) {
                         server.queue.shift();
                     }*/
                    //message.channel.send("clearing queue");

                    search(songname, function(err, r) {

                        if (err) message.channel.send('tnekna, tnekna ya zebi tnekna ! ');
                        message.channel.send('playing ' + songname);
                        let videos = r.videos.slice(0, 10);
                        /*for (var i in videos) {
                            console.log(videos[i].title + '\n');
                        }*/
                        try {

                            message.channel.send(' ' + videos[0].title);
                            message.channel.send(' ' + videos[0].url);
                            url = videos[0].url;
                            server.queue.push(url);
                            console.log(iamin);
                            if (iamin === 'yes') {
                                return;
                            }

                            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                                iamin = 'yes'
                                play(connection, message);
                                console.log(server);
                            })
                        } catch (ex) { message.channel.send('something went wrong please try again ' + ex); }
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