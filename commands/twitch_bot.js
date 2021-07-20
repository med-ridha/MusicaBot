const extra = require('./extra.js')
const tmi = require('tmi.js');
const translate = require('./translate.js')
const pickuplines = extra.pickuplines;
const emotes = extra.emotes;
const puns = extra.puns;
const master = process.env.master;
const username = process.env.username;
const mrStreamer = process.env.channel;
const channels = [mrStreamer, master]

const client = tmi.Client({
    options: { debug: false, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: master,
        password: process.env.oauth
    },
    channels: channels
});

client.connect().catch(console.error);

client.on('connected', () => {
    console.log(`connected to ${mrStreamer}`)
})

client.on('disconnected', () => {
    console.log(`disconneted from ${mrStreamer}`)
})

var p = 0;
var g = 0;
var spamtheJAM = null;
var join = false;
var activated = false;
let messages = [];
var uniquechatters = [];
var nexttime = [];
var t = [];
client.on('message', (channel, tags, message, self) => {

    if (self) {
        return;
    }
    console.log(`<${tags.username}> : ${message}`);
    if (tags.username === master) {
        activated = true;
    }
    if (tags.username === master && message.includes(`good night`)) {
        activated = false;
    }
    if (activated) {
        message = message.toString().replace(/\s+/g, ' ');
        var args = message.split(" ");
        if(uniquechatters[tags.username] === undefined) uniquechatters[tags.username] = true;
        if(!message.includes('$translate') && !message.includes('$transto')){
            messages.push(["@"+tags.username.toLowerCase(), message]);
        }

        if(messages.length > 60) messages.shift();
        if (args[0].toLowerCase() === "$translate") {
            if(uniquechatters[tags.username]){
                if(args[1]){
                    messages.reverse();
                    let msg = "";
                    if(args[1].indexOf('@') >= 0){
                        for(let i = 0; i < messages.length; i++){
                            if(messages[i][0].toLowerCase() === args[1].toLowerCase()){
                                msg += messages[i][1];
                                msg += " / "
                            }
                        }
                    }
                    translate.translate(args, msg).then(trans => {
                        client.say(mrStreamer, `${trans} @${tags.username}`);
                    });
                    uniquechatters[tags.username] = false;
                    nexttime[tags.username] = 60*2;
                    t[tags.username] = setInterval(() => { nexttime[tags.username] -= 1}, 1000);
                    setTimeout(()=>{ uniquechatters[tags.username] = true; clearInterval(t[tags.username]) }, (60000*2))
                }else{
                    client.say(mrStreamer, `@${tags.username} $translate [message or @username]`)
                }
            }else{
                client.say(mrStreamer, `@${tags.username} ayo chill, for spamming and rate limiting purposes this ability is on cooldown for you, ${nexttime[tags.username]} seconds remaining`)
            }
        }

        if(channel === '#'+master){
            if(args[0] === '$transto'){
                if(tags.username.toLowerCase() === master){
                    translate.translateTo(args).then(msg => {
                        client.say(mrStreamer, `${msg}`);
                    });
                }else{
                    client.say(master, `@${tags.username} Get Out!`);
                }
            }
        }
        if (!join && tags.username.toLowerCase() === 'streamelements' && message.includes(`Enter by typing "!join"`)) {
            client.say(mrStreamer, `!join`);
            join = true;
            setTimeout(() => {
                join = false;
            }, 60000);
        }

        if (message.includes(`it`) && message.includes(`s`) && message.includes(`my`) && (message.includes(`birthday`) || message.includes(`bday`))) {
            setTimeout(() => {
                client.say(mrStreamer, `@${tags.username} happy birthday!`)
            }, 3000);
        }

        if (message.includes(`what's poppin`) || message.includes(`whats poppin`) || message.includes(`wuz poppin`)) {
            setTimeout(() => {
                client.say(mrStreamer, `@${tags.username} don't mind me just watching`);
            }, 1000);
        }


        if (message.includes('pick') && message.includes('up') && message.includes(`line`)) {
            if (p < pickuplines.length) {
                client.say(mrStreamer, `@${tags.username} ${pickuplines[p]}`);
                p++;
                return;
            } else {
                if (message.includes(username)) {
                    client.say(mrStreamer, `@${tags.username} that is enough`)
                    return;
                }
            }
            return;
        }

        if (message.includes('!pun')) {
            if (g < puns.length) {
                client.say(mrStreamer, `${puns[g]}`);
                g++;
                return;
            } else {
                if (message.includes(username)) {
                    client.say(mrStreamer, `i am all out`)
                    return;
                }
            }
            return;
        }

        if (message.includes(username)) {
            if (message === master || message === username) {
                client.say(mrStreamer, `@${tags.username} yes`)
            }
            if (message.includes('stupid')) {
                setTimeout(() => {
                    client.say(mrStreamer, `${tags.username} i presume that your presumption is Precisely incorrect and your diabolical mind is insufficiently cultivated To comprehend my Meaning `)
                }, 3000);
                return;
            }
            if ((message.includes('thank') && (message.includes('u') || message.includes('you'))) || message.includes('thnx') || message.includes('merci') || message.includes('thnks')) {
                client.say(mrStreamer, `@${tags.username} you are welcome :D`)
            }
            if (message.includes('hahaha') || message.includes('ahahah') || message.includes(`hhhaaa`) || message.includes(`aahahaah`)) {
                client.say(mrStreamer, `@${tags.username} LUL`)
            }
            emotes.forEach(emote => {
                if (message.toLowerCase().includes(emote.toLowerCase())) {

                    client.say(mrStreamer, `@${tags.username} ${emote}`);
                    return;
                }
            })
        }

        let JAM = ['babyJAM', 'catJAM', `Dance`]
        let ph = ``;

        if (tags.username === master && message === '!spamtheJAM') {
            spamtheJAM = setInterval(() => {
                for (let i = 0; i < 35; i++) {
                    var pos = Math.floor(Math.random() * JAM.length)
                    ph += `${JAM[pos]} `
                }
                client.say(mrStreamer, ph);
                ph = ``;
            }, 1000);
        }

        if (tags.username === master && message === '!stoptheJAM') {
            clearInterval(spamtheJAM);
        }
    }

});
