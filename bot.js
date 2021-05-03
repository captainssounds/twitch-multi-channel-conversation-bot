const irc = require('irc');

// Get settings
const settings = {
    channels: ['#channel1', '#channel2'],
    server: 'irc.twitch.tv',
    botName: 'yourbotname',
    password: 'oauth:youroauthpassword' //find at http://www.twitchapps.com/tmi
};

console.log('*** Bot Started ***');
console.log('Running on channels:', settings.channels);

// Create the bot
const bot = new irc.Client(settings.server, settings.botName, {
    channels: [settings.channels + ' ' + settings.password],
    debug: false,
    password: settings.password,
    username: settings.botName
});

init(bot);

function init() {
    addErrorListener();
    addMessageListener();
    addConnectListener();
}

function addErrorListener() {
    bot.addListener('error', (message) => {
        console.log('*** Error ***');
        console.log(message);
    });
}

function addConnectListener() {
    bot.addListener('connect', function() {
        console.log('*** Bot Connected ***');
        bot.say(settings.channels[0], 'Captain chat bot engaged!');
    });
}

function addMessageListener() {
    bot.addListener('message', (from, to, text, message) => {
        // console.debug('MESSAGE: ', from, to, text, message);
        if (!isCommand(text)) {
            sendToOtherChannel(to, from, text);
        }
    });
}

function isCommand(message) {
    return message.startsWith('!');
}

function sendToOtherChannel(to, from, text) {
    settings.channels.forEach((channel) => {
        if (
            to !== channel
            && from !== settings.botName
            && !hasLink(text)
        ) {
            bot.say(channel, `[${to}][${from}] ${text}`);
        }
    });
}

function hasLink(text) {
    const re = /(([a-z]+:\/\/)?(([a-z0-9-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|tv|local|internal|xxx))(:[0-9]{1,5})?(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
    // console.debug(text.match(re));
    return re.test(text);
}
