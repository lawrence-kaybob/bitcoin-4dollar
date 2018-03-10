'use strict';

var builder = require('botbuilder');
var restify = require('restify');
var redis = require('redis');
var fs = require('fs');

var mysql = require('mysql');
var mySqlConnection = mysql.createConnection({
    host: 'byundb.c9aqtsksy9we.ap-northeast-2.rds.amazonaws.com',
    user: 'class',
    password: 'byunDB12!@',
    timezone: 'local'
});
var connectionManage = require('./db-connection');
var redisClient = redis.createClient();

var config = require('./config');
var serverOption = {
	url: 'b4d.lkaybob.pe.kr',
	// certificate: fs.readFileSync(config.certPath + 'fullchain.pem'),
	// key: fs.readFileSync(config.certPath + 'privkey.pem')
};
var server = restify.createServer(serverOption);

server.use(restify.plugins.bodyParser({
	mapParams: true
}));


connectionManage.connect(mySqlConnection);
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log("%s listening to %s", server.name, server.url);
});

var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID || config.appId,
	appPassword: process.env.MICROSOFT_APP_PASSWORD || config.appPassword
});

var bot = new builder.UniversalBot(connector, {
	localizerSettings : {
		defaultLocale: "kr"
	}
});

var formatter = require('./strings/number-format');
formatter.init();

require('./dialog/main')(bot, builder, redisClient);
require('./dialog/showRate')(bot,builder, mySqlConnection, formatter);
require('./dialog/create-notification')(bot, builder, mySqlConnection);
require('./dialog/notification-test')(bot,redisClient);

var customNotify = require('./dialog/realtime-notification');
var globalNotify = require('./dialog/global-notification');

customNotify.init(bot, builder, redisClient, mySqlConnection, formatter);
globalNotify.init(bot, builder, redisClient, formatter);

bot.dialog('/',  function (session) {
	session.replaceDialog('/greetings');
});

server.post('/api/messages', connector.listen());
server.post('/api/custom-notify', function (request, response) {
    var param = request.params.id;

    customNotify.sendNotification(JSON.parse(param));
    response.send(202, "OK");
});

server.post('/api/global-notify', function (request, response) {
    var param = request.params.id;

    // 처리할 함수 넣기
    globalNotify.globalNotification(JSON.parse(param));
    response.send(202, "OK");
});