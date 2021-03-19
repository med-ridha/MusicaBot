const extra = require('./extra.js')
const tmi = require('tmi.js');
const pickuplines = extra.pickuplines;
const emotes = extra.emotes;
const puns = extra.puns;
const master = process.env.master;
const username = process.env.username;
const mrStreamer = process.env.channel;


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
    channels: [mrStreamer]
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
client.on('message', (channel, tags, message, self) => {

    if (self) {
        console.log(`<${tags.username}> : ${message}`);
        return;
    }
    if (tags.username === master) {
        activated = true;
    }
    if (tags.username === master && message.includes(`good night`)) {
        activated = false;
    }
    if (activated) {

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

        JAM = ['babyJAM', 'catJAM', `Dance`]
        ph = ``;

        if (tags.username === master && message === '!spamtheJAM') {
            spamtheJAM = setInterval(() => {
                for (i = 0; i < 35; i++) {
                    pos = Math.floor(Math.random() * JAM.length)
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