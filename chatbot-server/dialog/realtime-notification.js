'use strict';

var messages = require('./messages');
var util = require('util');

var self = module.exports =  {
    init: function(bot, builder, redisClient, mySqlConnection, formatter) {
        self.bot = bot;
        self.builder = builder;
        self.redisClient = redisClient;
        self.mySqlConnection = mySqlConnection;
        self.formatter = formatter;

        return self;
    },
    sendNotification: function(ids) {

        var date = Date.now();
        date = new Date(date - 1000*60*10);

        for(var i in ids) {
            var msgForamtHead = '%s가 원하는 %s 시세 범위 안에 들어왔네. 지금이 기회일세!<br/>' +
                '[설정시세] %s원 [현재시세 @ %s] %s원<br/>' +
                '%s';

            var queryStatement = util.format('select id, currency, threshold, deal from notifyMarket where id=\"%s\" and lastNotifyTime < \"%s-%s-%s %s:%s\"',
                ids[i].id, date.getUTCFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());


            self.mySqlConnection.query(queryStatement, function (err, results) {
                if(err) {
                    console.log('[Error on proactive message]' + err.stack);
                }
                else {
                    if (results.length != 0) {

                        var index = self.findIndex(results[0].id, ids);

                        var deal = '매수';
                        var currency = '비트코인';
                        var page;

                        if (results[0].deal == 'BID')
                            deal = '매도';

                        switch(ids[index].page) {
                            case 'KBT':
                                page = '코빗';
                                break;
                            case 'CNN':
                                page = '코인원';
                                break;
                            case 'BTH':
                                page = '빗썸';
                                break;
                        }

                        switch (results[0].currency) {
                            case 'BTC':
                                break;
                            case 'BCH':
                                currency = '비트코인 캐쉬';
                                break;
                            case 'ETH':
                                currency = '이더리움';
                                break;
                            case 'ETC':
                                currency = '이더리움 클래식';
                                break;
                            case 'XRP':
                                currency = '리플';
                                break;
                        }

                        var url = self.generateLink(results[0].currency, ids[index].page);

                        var finalMsg = util.format(msgForamtHead, currency, deal, self.formatter.currency.format(results[0].threshold),
                            page, self.formatter.currency.format(ids[index].rate), url);

                        self.redisClient.get(results[0].id, function (err, reply) {
                            // console.log('Redis response : ' + i + ' ' + reply);
                            if (err)
                                console.log('[Redis Package] Error getting address of : ' + ids[i] + '\n\n' + err);
                            else if (reply != null) {
                                // console.log(JSON.parse(reply));

                                var msg = new self.builder.Message().address(JSON.parse(reply));
                                msg.text(finalMsg);
                                msg.textLocale('kr');
                                self.bot.send(msg);

                                var date = new Date();
                                var dateString = util.format("%s-%s-%s %s:%s",
                                    date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes());
                                var updateQuery = 'update notifyMarket set lastNotifyTime=\'%s\' where id=%s and currency=\'%s\'';
                                updateQuery = util.format(updateQuery, dateString, results[0].id, results[0].currency);
                                self.mySqlConnection.query(updateQuery);
                            }
                        });
                    }
                }
            });
        }
    },
    findIndex : function (key, ids) {
        for(var i in ids) {
            if(key == ids[i].id)
                return i;
        }
    },
    generateLink: function (currency, page) {
        var url;
        switch(page) {
            case 'BTH':
                url = 'https://bithumb.com/'
                switch(currency) {
                    case 'BTC':
                        url += 'u2/US251';
                        return url;
                    case 'BCH':
                        url += 'trade/order/BCH';
                        return url;
                    case 'ETH':
                        url += 'trade/order/ETH';
                        return url;
                    case 'ETC':
                        url += 'trade/order/ETC';
                        return url;
                    case 'XRP':
                        url += 'trade/order/XRP';
                        return url;
                }
                break;
            case 'KBT':
                url = 'https://www.korbit.co.kr/orders/'
               switch(currency) {
                   case 'BTC':
                       url += 'btc_krw';
                       return url;
                   case 'BCH':
                       url += 'bch_krw';
                       return url;
                   case 'ETH':
                       url += 'trade/order/eth_krw';
                       return url;
                   case 'ETC':
                       url += 'trade/order/etc_krw';
                       return url;
                   case 'XRP':
                       url += 'trade/order/xrp_krw';
                       return url;
               }
               break;
            case 'CNN':
                url = 'https://coinone.co.kr/exchange/trade/'
                switch(currency) {
                    case 'BTC':
                        url += 'btc';
                        return url;
                    case 'BCH':
                        url += 'bch';
                        return url;
                    case 'ETH':
                        url += 'eth';
                        return url;
                    case 'ETC':
                        url += 'etc';
                        return url;
                    case 'XRP':
                        url += 'xrp';
                        return url;
                }
                break;
        }
    }
};