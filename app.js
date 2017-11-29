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

var config = require('./config');
var serverOption = {
	url: 'b4d.lkaybob.pe.kr',
	certificate: fs.readFileSync(config.certPath + 'fullchain.pem'),
	key: fs.readFileSync(config.certPath + 'privkey.pem')
};
var server = restify.createServer(serverOption);

mySqlConnection.connect(function (err) {
	if(err)
		console.log('[MySQL Package] Error Connecting MySQL Instance: ' + err.stack);
	else {
		console.log('Databse Server Connected');
		mySqlConnection.query('use bc4dollar', function(err){
            if(err)
                console.log('[MySQL Package] Error Selecting Database:' + err.stack);
            else
                console.log('Selected Database');
        })
    }
});

server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log("%s listening to %s", server.name, server.url);
});

var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID || config.appId,
	appPassword: process.env.MICROSOFT_APP_PASSWORD || config.appPassword
});

server.post('/api/messages', connector.listen());
server.post('/api/notifyListener', function (request, response) {
	console.log(request);
	response.send(202, "OK");
});

var bot = new builder.UniversalBot(connector, {
	localizerSettings : {
		defaultLocale: "kr"
	}
});

require('./dialog/main')(bot, builder, mySqlConnection);
require('./dialog/showRate')(bot,builder, mySqlConnection);
require('./dialog/createNotification')(bot, builder, mySqlConnection);
require('./dialog/notificationTest')(bot, builder, redis);

bot.dialog('/',  function (session) {
	session.replaceDialog('/greetings');
});

// savedAddress에는 JSON.stringify와 JSON.parse를 쓸 예정
// 알림(Broadcast를 위해서 session.message.address.id)를 List로 저장
// 다시 개별 회원들에 대한 정보는 String 형식의 Key-Value값으로 저장
// ex. {broadcase : [id들]}
// {6g98dfai7mg4 : '{"id":"6g98dfai7mg4","channelId":"emulator","user":{"id":"default-user","name":"User"},"conversation":{"id":"iiciialk5fla"},"bot":{"id":"default-bot","name":"Bot"},"serviceUrl":"http://localhost:56569"}'}
// 이런 식....

// 참고 : https://www.npmjs.com/package/redis
// http://bcho.tistory.com/654
// https://redis.io/commands#list