/**
 * Created by lkaybob on 2017. 11. 22..
 */
var util = require('util');

var messages = require('./messages');
var queryValues = require('../strings/query-value');

require('util');

/**
 * showRate.js: 현재 시세 알려주기
 * */
module.exports = function (bot, builder, mysqlConnection) {
    // 날릴 쿼리의 포멧을 설정
    // util.format을 이용해서 Parameter 합성하기

    bot.dialog('/showRate', [function (session) {
        // Q : 어떤 화폐의 시세를 알고 싶은가 (비트코인 비트코인 클래식 이더리움, 이더리움 클래식, 리플)
        var message = messages.askNotifyCurrency;
        var choices = messages.choiceNotifyCurrency;

        builder.Prompts.choice(session, message, choices);
    }, function (session, result) {
        // 이전 응답을 먼저 처리 (어떤 화폐인가)
        var selection = result.response.entity;
        var market = 'market%s';

        session.userData.rateQuery = {
            fullQuery: queryValues.rateQuery,
            currency : null,
            deal: null
        };

        switch (selection){
            // 쿼리를 여기서 합성
            case '비트코인':
                session.userData.rateQuery.currency = queryValues.bitcoin;
                break;
            case '비트코인 캐쉬':
                session.userData.rateQuery.currency = queryValues.bitcoinCash;
                break;
            case '이더리움':
                session.userData.rateQuery.currency = queryValues.ethereum;
                break;
            case '이더리움 클래식':
                session.userData.rateQuery.currency = queryValues.etherumClassic;
                break;
            case '리플':
                session.userData.rateQuery.currency = queryValues.ripple;
                break;
        }

        market = util.format(market, session.userData.rateQuery.currency);
        session.userData.rateQuery.fullQuery
            = util.format(session.userData.rateQuery.fullQuery, "%s", market, "%s", "%s", "%s");

        // Q: (화폐 이름)의 어떤 시세를 알고 싶은가?
        var message = messages.askDealRate;
        var choices = messages.dealChoices;

        builder.Prompts.choice(session, message, choices);
    }, function (session, result) {
        // 어떤 시세인지 물어봐야겠지
        var date = new Date();
        var currentDate = util.format("'%s-%s-%s %s:%s'",
                date.getYear()+1900, date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes());
        var attr;

        session.userData.rateQuery.deal = result.response.entity;

        switch(session.userData.rateQuery.deal) {
            case '일반':
                attr = queryValues.marketPrice;
                session.userData.rateQuery.fullQuery
                 = util.format(session.userData.rateQuery.fullQuery, attr, currentDate, queryValues.marketPrice, queryValues.orderAsc);
                break;
            case '매수':
                attr = util.format("%s, %s", queryValues.highAsk, queryValues.lowAsk);
                session.userData.rateQuery.fullQuery
                = util.format(session.userData.rateQuery.fullQuery, attr, currentDate, queryValues.highAsk, queryValues.orderAsc);
                break;
            case '매도':
                attr = util.format("%s, %s", queryValues.highBid, queryValues.lowBid);
                session.userData.rateQuery.fullQuery
                = util.format(session.userData.rateQuery.fullQuery, attr, currentDate, queryValues.lowBid, queryValues.orderDec);
                break;
        }

        // 시간 합성해서 쿼리 날리기
        mysqlConnection.query(session.userData.rateQuery.fullQuery, function (err, results){
            if(err) {
                console.log('[Session ID] ' + session.message.address + ' Error Occured:' + err.stack);
            }
            else {
                console.log("[MySQL Callback] " + results[0]);

                var resultDate = new Date(results[0].marketTime);
                var currency = currencyCodeToLiteral(session.userData.rateQuery.currency);
                var message = util.format(messages.returnQueryResult,
                        resultDate.getYear()+1900, resultDate.getMonth() + 1, resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes(),
                        messages.choiceNotifyCurrency[currency], session.userData.rateQuery.deal
                    );

                for (var i in results) {
                    switch(session.userData.rateQuery.deal) {
                        case "매수":
                            message += util.format(messages.resultAskTemplate + "<br/>",
                                pageCodeToLiteral(results[i].dealPage), results[i].lowAsk, results[i].highAsk);
                            break;
                        case "매도":
                            message += util.format(messages.resultBidTemplate + "<br/>",
                                pageCodeToLiteral(results[i].dealPage), results[i].highBid, results[i].lowBid);
                            break;
                        case "일반":
                            message += util.format(messages.resultMarketTemplate + "<br/>",
                                pageCodeToLiteral(results[i].dealPage), results[i].marketPrice);
                            break;
                    }
                }
                session.send(message);
                session.replaceDialog('/mainSelection');
            }
        });

    }]);

    var pageCodeToLiteral = function (dealPage) {
        switch(dealPage) {
            case 'BTH':
                return '빗썸';
            case 'KBT':
                return '코빗';
            case 'CNN':
                return '코인원';
        }
    }

    var currencyCodeToLiteral = function (currency) {
        switch(currency) {
            case 'BTC':
                return 0;
            case 'BCH':
                return 1;
            case 'ETH':
                return 2;
            case 'ETC':
                return 3;
            case 'XRP':
                return 4;
            default:
                return -1;
        }
    }
};