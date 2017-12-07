/**
 * Created by lkaybob on 2017. 11. 22..
 */

// var builder = require('botbuilder');
// var bot = new builder.UniversalBot(connector);
var messages = require('./messages');

module.exports  = function (bot, builder, redisClient) {

    bot.dialog('/greetings', [function (session) {
        var message = messages.greetings;
        session.send(message);
        session.replaceDialog('/mainSelection');
    }]);

    bot.dialog('/mainSelection', [function (session) {
        console.log(session.message.address.conversation.id);
        redisClient.get(session.message.address.conversation.id, function (err, reply) {
            if(err)
                console.log('[Redis Package] Error connecting to database: ' + err);
            else {
                if(reply == null){
                    redisClient.set(session.message.address.conversation.id, JSON.stringify(session.message.address), function (err, reply) {
                        if(err)
                            console.log('[Redis Package] Error connecting to database: ' + err);
                        else
                            console.log('[Redis Package] Client Added');
                    });
                    redisClient.sadd('broadcast', session.message.address.conversation.id, function (err, reply) {
                        if(err)
                            console.log('[Redis Package] Error connecting to database: ' + err);
                    });
                }
            }
        });

        var choices = ['시세확인', '알림예약'/*, '알림테스트'*/];
        var message = messages.selection;

        builder.Prompts.choice(session, message, choices);
    }, function (session, results) {
        if(results.response) {
            var selection = results.response.entity;

            switch(selection) {
                case '1':
                case "시세확인":
                    session.replaceDialog('/showRate');
                    break;
                case '2':
                case "알림예약":
                   session.replaceDialog('/checkDuplicateNotification');
                    break;
                case '3':
                case "알림테스트":
                    session.replaceDialog('/notificationTest');
                    break;
            }
        }
    }]);
};