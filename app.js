var builder = require('botbuilder');
var restify = require('restify');
var fs = require('fs');
var config = require('./config');

var serverOption = {
	url: 'b4d.lkaybob.pe.kr',
	certificates: fs.readFileSync(config.certPath + 'fullchanin.pem'),
	key: fs.readFileSync(config.certPath + 'privkey.pem')
}
var server = restify.createServer(serverOption);
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log("%s listening to %s", server.name, server.url);
});

var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID || config.appId,
	appPassword: process.env.MICROSOFT_APP_PASSWORD || config.appPassword
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});