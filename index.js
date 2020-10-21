const Discord = require('discord.js');
const bot = new Discord.Client();
const solenolyrics = require("solenolyrics");
const ytdl = require('ytdl-core');
const { YouTube } = require('popyt');
const search = new YouTube(process.env.apiKey);
const { MongoClient } = require('mongodb');
const uri = process.env.MONGOD_URL;
//const client = new MongoClient(uri);
const prefix = '+';
var servers = {};
var people = [];

function Comparator(a, b) {
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
}
async function leaderBoard(message) {

    MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("people").find({}).toArray(async function(err, result) {
            if (err) throw err;
            var i = 0;
            for (i = 0; i < result.length; i++) {
                people[i] = [result[i].name, result[i].count];

            }
            people = people.sort(Comparator);
            people.reverse()
            for (i = 0; i < people.length; i++) {
                message.channel.send(`${i+1} : ${people[i]}`);
            }

            await db.close();
        });
    });

}

async function addtodb(message, name, count) {
    MongoClient.connect(uri, { useUnifiedTopology: true }, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        await dbo.collection("people").findOne({ name: name }).toArray(function(err, result) {
            if (err) throw err;
            if (result) {
                var myquery = { name: name };
                var newvalues = { $set: { name: name, count: result.count += count } };
                dbo.collection("people").updateOne(myquery, newvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");

                });
                await db.close();

            } else {
                var myobj = { name: name, count: count };
                dbo.collection("people").insertOne(myobj, async function(err, res) {
                    if (err) throw err;
                    message.channel.send(`${name} tzad fi lista`);
                    await db.close();
                });
            }

        });

    });
}

async function update(message, name, count) {
    MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { name: name, count: count };
        dbo.collection("people").updateOne({ name: name }, myobj, async function(err, res) {
            if (err) throw err;
            message.channel.send(`${name} tzad fi lista`);
            await db.close();
        });
    });
}


bot.on('ready', () => {
    console.log('this bot is online');
});

function sendMessage(message, msg) {
    message.channel.startTyping();
    setTimeout(() => {
        message.channel.send(msg).then((message) => {
            message.channel.stopTyping();
        });
    }, 2000)
}

async function getLyrics(message, songname) {

    var lyrics = await solenolyrics.requestLyricsFor(songname);

    while (lyrics) {
        message.channel.send(lyrics.substring(0, 2000))
        lyrics = lyrics.substring(2000);
    }

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
            sendMessage(message, "ma3adach fama songs fil queue, hani 5rajet");
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



        try {
            if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {

                if (message.guild.voice.connection.dispatcher) {
                    message.channel.send('Queued ' + r.title);

                    return;
                }
                message.channel.send('playing ' + r.title);
                play(connection, message);
                console.log(server);
            })
        } catch (ex) { console.log(ex) }
    } catch (ex) {
        sendMessage(message, "mal9it 7ata song ");
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
                case 'add':
                    if (message.member.hasPermission("ADMINISTRATOR")) {
                        addtodb(message, args[1], parseInt(args[2]));
                    } else {
                        sendMessage(message, "makch admin");
                    }
                    break;
                case 'leaderBoard':
                    leaderBoard(message);
                    break;
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
                        server.queue.push(args[1]);
                        if (!message.member.voice.connection) message.member.voice.channel.join().then(function(connection) {
                            if (message.guild.voice.connection.dispatcher) {
                                message.channel.send('Queued ' + args[1]);
                                console.log(server);
                                return;
                            }
                            message.channel.send('playing ' + server.queue[0]);
                            play(connection, message);
                            console.log(server);
                        })

                        return;
                    }
                    searchsong(message, songname);
                    break;

                case 'lyrics':
                    if (!songname) {
                        message.channel.send("7ot el esm 3asba");
                        return;
                    }
                    getLyrics(message, songname);
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