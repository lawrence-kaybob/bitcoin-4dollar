'use strict';

var messages = require('./messages');
var queryValue = require('../strings/query-value');
var util = require('util');

module.exports = function (bot, builder, mySqlConnection) {
    bot.dialog('/checkDuplicateNotification', function (session) {
        if(session.userData.notification) {
            session.replaceDialog('/notifyDuplicate');
        } else {
            session.replaceDialog('/setNotification');
        }
    });

    bot.dialog('/setNotification', [function (session) {
        session.userData.notification
            = queryValue.notifyInsertQuery;

        // 알림 추가 프로세스
        session.send(messages.notifyCaution);
        builder.Prompts.choice(session, messages.askNotifyCurrency, messages.choiceNotifyCurrency);
    }, function (session, results) {
        var selection;

        switch(results.response.entity) {
            case '비트코인':
                selection = queryValue.bitcoin;
                break;
            case '비트코인 캐쉬':
                selection = queryValue.bitcoinCash;
                break;
            case '이더리움':
                selection = queryValue.ethereum;
                break;
            case '이더리움 클래식':
                selection = queryValue.etherumClassic;
                break;
            case '리플':
                selection = queryValue.ripple;
                break;
        }

        session.userData.notification
            = util.format(session.userData.notification, selection);

        builder.Prompts.choice(session, messages.askNotifyDeal, messages.choiceNotifyDeal);
    }, function (session, results) {
        var selection;

        switch(results.response.entity) {
            case '매수':
                selection = 'ASK';
                break;
            case '매도':
                selection = 'BID';
                break;
        }

        session.userData.notification
            = util.format(session.userData.notification, selection);

        builder.Prompts.number(session, messages.askNotifyThreshold);
    }, function (session, results) {
        console.log(results.response);

        session.userData.notification
            = util.format(session.userData.notification, results.response, session.message.address.id, 'null');

        mySqlConnection.query(session.userData.notification, function (err) {
            if(err) {
                console.log('[Session ID] ' + session.message.address + ' Error Occured:' + err.stack);
            }
            else {
                session.send(messages.confirmNotifyRegistered);
                session.replaceDialog("/mainSelection");
            }
        })
    }]);

    bot.dialog('/notifyDuplicate', [function (session) {
        var message = messages.askDuplicateNotification;
        var choice = messages.choiceYN;

        builder.Prompts.choice(session, message, choice);
    }, function (session, results) {
        switch(results.response.entity) {
            case "네":
                session.userData.notification = null;
                session.replaceDialog('/setNotification');
                break;
            case "아니오":
                session.send(messages.returnToMainSelection);
                session.replaceDialog('/mainSelection');
                break;
        }
    }])
};

// TODO: Session.userData를 어떻게 저장할 수 있을까?