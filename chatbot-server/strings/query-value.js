module.exports = {
    rateQuery: 'select marketTime, dealPage, %s from %s where marketTime>%s group by dealpage order by %s %s',

    orderAsc : 'asc',
    orderDec : 'desc',

    min: 'min(%s)',
    max: 'max(%s)',

    highAsk: 'highAsk',
    lowAsk: 'lowAsk',
    highBid: 'highBid',
    lowBid: 'lowBid',
    marketPrice: 'marketPrice',

    bitcoinCash: 'BCH',
    bitcoin : 'BTC',
    ethereum: 'ETH',
    etherumClassic : 'ETC',
    ripple : 'XRP',

    notifyInsertQuery: 'insert into notifyMarket(currency, deal, threshold, id, lastNotifyTime) ' +
    'values ("%s", "%s", "%s", "%s", "%s")',

    deleteNotifySetting: 'delete from notifyMarket where id ="%s"'
};