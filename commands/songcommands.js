const ytdl = require('ytdl-core');
const { YouTube } = require('popyt');
const search = new YouTube(process.env.apiKey);
var servers = {};

async function searchsongurl(message, x) {
    let b = await search.getVideo(x);
    message.channel.send('playing ' + b.title);
}

async function play(connection, message) {
    var server = servers[message.guild.id];
    dispatcher = await connection.play(ytdl(server.queue[0], { filter: "audioonly" }));
    if (!message.guild.voice.connection.dispatcher) {
        dispatcher = await connection.play(ytdl(server.queue[0], { filter: "audioonly" }));
    }
    dispatcher.on("finish", () => {
        server.queue.shift();
        console.log(server);

        if (server.queue[0]) {
            searchsongurl(message, server.queue[0]);
            play(connection, message);
        } else {

            message.channel.send('ma3adach fama songs fil queue, hani 5arej');

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
        try {
            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {

                if (message.guild.voice.connection.dispatcher) {
                    server.queue.push(r.url);
                    message.channel.send('Queued ' + r.title);
                    console.log(server);
                } else {
                    server.queue = [];
                    server.queue.push(r.url);
                    message.channel.send('playing ' + r.title);
                    play(connection, message);
                    console.log(server);
                }
            })
        } catch (ex) { console.log(ex) }
    } catch (ex) {

        message.channel.send('mal9it chay ');
    }
}

async function getPlaylist(message, songname) {
    server = servers[message.guild.id];
    const playlist = await search.getPlaylist(songname);
    await playlist.fetchVideos(15);
    let videos = playlist.videos;
    let queue = []
    videos.forEach(element => {
        queue.push(element.url);
        console.log(element.title);
    });
    console.log(queue);
    if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
        if (message.guild.voice.connection.dispatcher) {
            queue.forEach(element => {
                server.queue.push(element);
            });

            message.channel.send('Queued ' + songname);
            console.log(server);
        } else {
            server.queue = [];
            server.queue = queue;
            message.channel.send('playing ' + server.queue[0]);
            play(connection, message);
            console.log(server);
        }
    })

}

module.exports.play = async function(message, songname) {

    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    }
    var server = servers[message.guild.id];
    if (songname.includes("https://www.youtube.com/")) {
        if (songname.includes("&list") || songname.includes("playlist")) {
            getPlaylist(message, songname);
        } else {
            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                if (message.guild.voice.connection.dispatcher) {
                    server.queue.push(songname);
                    message.channel.send('Queued ' + songname);
                    console.log(server);
                } else {
                    server.queue = [];
                    server.queue.push(songname);
                    message.channel.send('playing ' + server.queue[0]);
                    play(connection, message);
                    console.log(server);
                }
            })
        }
        return;
    }

    searchsong(message, songname);
}
module.exports.o5rej = async function(message) {
    try {
        if (message.guild.voice.connection) {
            message.channel.send("hani 5arej");
            message.guild.voice.connection.disconnect();
        } else {
            message.channel.send("da5alni fi room 9bal");
        }
    } catch (ex) {
        message.channel.send("da5alni fi room 9bal");
    }
}

module.exports.a9ef = async function(message) {
    try {
        dispatcher.pause();
    } catch (ex) {
        message.channel.send("da5alni fi room 9bal");
    }
}
module.exports.kamel = async function(message) {
    try {
        dispatcher.resume();
    } catch (ex) {
        message.channel.send("da5alni fi room 9bal");
    }
}

module.exports.aadi = async function(message) {
    try {
        dispatcher.end();
    } catch (ex) {
        message.channel.send("da5alni fi room 9bal");
    }
}