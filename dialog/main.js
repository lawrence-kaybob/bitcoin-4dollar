/**
 * Created by lkaybob on 2017. 11. 22..
 */

// var builder = require('botbuilder');
// var bot = new builder.UniversalBot(connector);
var messages = require('./messages');

module.exports  = function (bot, builder, mySqlConnection) {

    bot.dialog('/greetings', [function (session) {
        var message = messages.greetings;
        session.send(message);
        session.replaceDialog('/mainSelection');
    }]);

    bot.dialog('/mainSelection', [function (session) {
        var choices = ['시세확인', '알림예약', '알림테스트'];
        var message = messages.selection;
        builder.Prompts.choice(session, message, choices);
    }, function (session, results) {
        if(results.response) {
            var selection = results.response.entity;
            // new builder.Message().address()

            switch(selection) {
                case '1':
                case "시세확인":
                    // 시세확인 Dialog로 넘어갈 것
                    session.replaceDialog('/showRate');
                    break;
                case '2':
                case "알림예약":
                    // 알림예약 Dialog로 넘어갈 것
                   session.replaceDialog('/createNotification');
                    break;
                case '3':
                case "알림테스트":
                    session.replaceDialog('/notificationTest');
                    break;
            }
        }
    }]);

    // TODO : Text Locale을 변경해야함
    // TODO : Promps.choice에 대한 예외처리 문구(I didn't understand. Please choose an option from the list.)를 따로 구현해줘야함
};