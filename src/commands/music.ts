import {
    AudioPlayer,
    AudioPlayerStatus,
    StreamType,
    VoiceConnection,
    createAudioResource,
    entersState
} from "@discordjs/voice";
import { Message } from "discord.js";

import { YouTube } from 'popyt';
import ytdl from "ytdl-core";
const search = new YouTube(process.env.YoutubeAPIKEY);
const player = new AudioPlayer();

let servers = {};
let currentlyPlaying: any = null;

async function playing(message: Message, x: string) {
    let video = await search.getVideo(x).catch(console.error);
    if (!video) {
        return 1;
    }
    message.reply(`Playing: ${video.title}`);
}
function prepareSong(songURL: string) {
    const resource = createAudioResource(
        ytdl(
            songURL,
            {
                filter: "audioonly",
                quality: "lowestaudio"
            }
        ), {
        inputType: StreamType.Arbitrary,
    });
    player.play(resource);


    return entersState(player, AudioPlayerStatus.Playing, 50000);
}

function playSong(connection: VoiceConnection, message: Message) {
    //@ts-expect-error
    let server: any = servers[message.guild!.id];
    prepareSong(server.queue[0]);
    connection.subscribe(player);
    currentlyPlaying = server.queue.shift();
    console.log(server);
    const callback = () => {
        if (player.state.status === AudioPlayerStatus.Idle) {
            if (server.queue[0]) {
                playing(message, server.queue[0]);
                playSong(connection, message);
                player.removeListener('stateChange', callback);
            } else {
                currentlyPlaying = null;
                message.reply('ma3adach fama songs fil queue, Hani 5arej');
                player.removeListener('stateChange', callback);
                try {
                    player.stop();
                    connection.destroy()

                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
    player.on('stateChange', callback);
}

async function playSongFromName(connection: VoiceConnection, message: Message, songname: string) {
    //@ts-ignore
    let server = servers[message.guild!.id];
    let r = await search.getVideo(songname).catch(console.error);
    if (!r) {
        message.reply(`Item not found try different input`);
        return 1;
    }
    if (player.state.status === AudioPlayerStatus.Playing) {
        server.queue.push(r.url);
        Queued(message, r.url);
        console.log(server);
    } else {
        server.queue = [];
        server.queue.push(r.url);
        playing(message, r.url)
        playSong(connection, message);
    }
}

async function Queued(message: Message, x: string) {
    let video = await search.getVideo(x).catch(console.error);
    if (!video) {
        return 1;
    }
    message.reply(`Queued: ${video.title}`);
}
export async function play(connection: VoiceConnection, message: Message, songname: string) {
    //@ts-expect-error
    if (!servers[message.guild!.id]) servers[message.guild!.id] = {
        queue: []
    }
    //@ts-expect-error
    let server = servers[message.guild!.id];
    if (songname.includes("https://www.youtube.com/")) {
        if (songname.includes("list")) {
            //getPlaylist(message, songname);
        } else {
            if (player.state.status === AudioPlayerStatus.Playing) {
                server.queue.push(songname);
                Queued(message, songname);
            } else {
                server.queue = [];
                server.queue.push(songname);
                playing(message, server.queue[0]);
                playSong(connection, message);
            }
        }
    } else {
        playSongFromName(connection, message, songname);
    }

    return 0;
}

export async function stop(connection: VoiceConnection) {
    try {
        connection.destroy();
        player.stop();
    } catch (error) {
        console.error(error);
    }
}
/* async function Queued(message : Message, x: string) {
    let video = await search.getVideo(x).catch(console.error);
    if(!video){
        return 1;
    }
    var song = {
        color: 0x0099ff,
        title: "Queued " + video.title,
        url: video.url,
    };
    message.channel.send({ embed: song });
}
async function searchsongurl2(message, x) {
    let b = await search.getVideo(x).catch(console.error);
    if(!b){
        return 1;
    }
    var song = {
        color: 0x0099ff,
        title: "Queued " + b.title + " and placed in front of the queue",
        url: b.url,
    };
    message.channel.send({ embed: song });
}


async function searchsong(message, songname) {
    let server = servers[message.guild.id];
    let r = await search.getVideo(songname).catch(console.error);
    if(!r) {
        message.channel.send(`Item not found try different input`);
        return 1;
    }
    try {
        try {
            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                if (message.guild.voice.connection.dispatcher) {
                    server.queue.push(r.url);
                    Queued(message, r.url);
                    console.log(server);
                } else {
                    server.queue = [];
                    server.queue.push(r.url);
                    playing(message, r.url)
                    play(connection, message);
                }
            })
        } catch (ex) { console.log(ex) }
    } catch (ex) {
        message.channel.send('mal9it chay ');
    }
}

async function getPlaylist(message, songname) {
    let server = servers[message.guild.id];
    const playlist = await search.getPlaylist(songname).catch(console.error);
    await playlist.fetchVideos(25);
    let videos = playlist.videos;
    let queue = []
    videos.forEach(element => {
        queue.push(element.url);
    });
    if (!message.member.voice.connection) message.member.voice.channel.join().then(async function(connection) {
        if (message.guild.voice.connection.dispatcher) {
            queue.forEach(element => {
                server.queue.push(element);
            });
            let song = {
                color: 0x0099ff,
                title: "Queued " + queue.length + " songs",

            };
            message.channel.send({ embed: song });

        } else {
            server.queue = [];
            server.queue = queue;
            await playing(message, server.queue[0])
            let song = {
                color: 0x0099ff,
                title: "And queued " + (queue.length - 1) + " songs",

            };
            message.channel.send({ embed: song });
            play(connection, message);
        }
    })

}

module.exports.play = async function(message, songname) {
    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    }
    let server = servers[message.guild.id];
    if (songname.includes("https://www.youtube.com/")) {
        if (songname.includes("list")) {
            getPlaylist(message, songname);
        } else {
            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                if (message.guild.voice.connection.dispatcher) {
                    server.queue.push(songname);
                    Queued(message, songname);
                } else {
                    server.queue = [];
                    server.queue.push(songname);
                    playing(message, server.queue[0]);
                    play(connection, message);
                }
            })
        }
        return 0;
    }

    searchsong(message, songname);
    return 0;
}
module.exports.o5rej = async function(message) {
    try {
        if (message.guild.voice.connection) {
            message.channel.send("hani 5arej");
            message.guild.voice.connection.disconnect();
            currentlyPlaying = null;
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
        dispatcher.pause();
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

module.exports.aawed = async function(message) {
    let server = servers[message.guild.id];
    try {
        server.queue.unshift(currentlyPlaying);
        searchsongurl2(message, server.queue[0]);
    } catch (ex) {
        message.channel.send("mafama chay bach n3awdou");
    }
}

module.exports.info = async function(message, songname) {
  let video = null;
  if (songname) {
        video = await search.getVideo(songname).catch(console.error);
        if(!video){
            message.channel.send(`Item not found!`);
            return 1;
        }
    } else {
        if (currentlyPlaying !== null) {
            video = await search.getVideo(currentlyPlaying).catch(console.error);
            if(!video){
                message.channel.send(`Item not found!`);
                return 1;
            }
        } else {
            message.channel.send("song is missing");
            return 1;
        }
    }

    var songInfo = {
        color: 0x0099ff,
        title: video.title,
        url: video.url,
        thumbnail: {
            url: video.thumbnails.high.url
        },
        fields: [{
                name: 'duration',
                value: video._length.hours + ":" + video._length.minutes + ":" + video._length.seconds,
                inline: true,
            },
            {
                name: 'views',
                value: video.views,
                inline: true,
            },
            {
                name: "likes / dislikes",
                value: video.likes + "/" + video.dislikes,
                inline: false,
            },
        ],
    };
    message.channel.send({ embed: songInfo });
    return 0;
}

module.exports.kharej = async function(message, x) {
    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    }
    let server = servers[message.guild.id];
    if (x.toLowerCase() === 'all') {
        server.queue = [];
        return;
    }
    if (x > server.queue.length - 1) {
        message.channel.send("mafamch song fel pos hadhika");
    } else {
        server.queue.splice(x, 1);
    }
}
module.exports.queue = async function(message) {
    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    }
    let server = servers[message.guild.id];
    if (!server.queue[0]) {
        message.channel.send("mafamach queue");
        return;
    }

    //TODO: rewrite the queue command
} */
