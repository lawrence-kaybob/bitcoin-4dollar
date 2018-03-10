var util = require('util');

var self = module.exports = {
    init: function(bot, builder, redisClient, formatter) {
        self.bot = bot;
        self.builder = builder;
        self.redisClient = redisClient;
        self.formatter = formatter;
    },
    globalNotification: function (info) {
        // console.log(info);
        var messageHeader = '실시간 급등/급락 현황이라네<br/>';
        var messageInfo = "[%s @ %s]: %s원 (%s)<br/>";

        for (var i in info) {
            messageHeader += util.format(messageInfo, self.currencyToString(info[i].currency),
                self.pageToString(info[i].page), self.formatter.currency.format(info[i].currencyRate), self.rateToString(info[i].rate));
        }

        self.redisClient.smembers("broadcast", function(err, reply) {
            // console.log(reply);

            for (var i in reply) {
                self.redisClient.get(reply[i], function (err, reply) {
                    if(err)
                        console.log('[Redis Package] Error getting address of : ' + ids[i] + '\n\n' + err);
                    else if (reply != null) {
                        var msg = new self.builder.Message().address(JSON.parse(reply));
                        msg.text(messageHeader);
                        msg.textLocale('kr');
                        self.bot.send(msg);
                    }
                })
            }
        });
    },
    pageToString: function (code) {
        switch(code) {
            case 'BTH':
                return '빗썸';
            case 'CNN':
                return '코인원';
            case 'KBT':
                return '코빗';
        }
    },
    currencyToString: function(currency) {
        switch(currency) {
            case 'BTC':
                return '비트코인';
            case 'BCH':
                return '비트코인 캐쉬';
            case 'ETH':
                return '이더리움';
            case 'ETC':
                return '이더리움 클래식';
            case 'XRP':
                return '리플'
        }
    },
    rateToString: function (rate) {
        if(rate > 1)
            return util.format("전일 대비 %d%% 급등", self.formatter.percentage.format((rate - 1) * 100));
        else
            return util.format("전일 대비 %d%% 급락", self.formatter.percentage.format((rate + 1) * 100));
    }
}