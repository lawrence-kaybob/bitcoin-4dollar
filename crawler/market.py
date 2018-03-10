#!/usr/bin/python
#-*- coding: utf-8 -*-

from marketAPI import *
from market_tras import market_transaction

import datetime
import threading

market_func = marketAPI()
marketTran = market_transaction()

def currencyCrawler():
    pass
    pageName = ['KBT', 'CNN', 'BTH']
    tableName=['marketBCH', 'marketBTC', 'marketETH', 'marketETC', 'marketXRP']
    standard_List_C = ['bch', 'btc', 'eth', 'etc', 'xrp']
    standard_List_K = ['bch_krw', 'btc_krw', 'eth_krw', 'etc_krw', 'xrp_krw']
    standard_List_B = ['BCH', 'BTC', 'ETH', 'ETC', 'XRP']
    insertQuery = ('(%s, %s, %s, %s, %s, %s, %s)')

    marketPrice=0
    highAsk=0
    lowAsk=0
    highBid=0
    lowBid=0

    for j in range(len(pageName)):
        for i in range(len(standard_List_K)):
            if pageName[j] == 'KBT' :
                selected=standard_List_K[i]
            elif pageName[j] == 'CNN' :
                selected=standard_List_C[i]
            elif pageName[j] == 'BTH' :
                selected=standard_List_B[i]

            marketPrice = market_func.getmarketPriceData(pageName[j], selected)
            highAsk=market_func.gethighAsk(pageName[j], selected)
            lowAsk =market_func.getlowAsk(pageName[j], selected)
            highBid = market_func.gethighBid(pageName[j], selected)
            lowBid = market_func.getlowBid(pageName[j], selected)
            now = datetime.datetime.now()
            timestamp = now.strftime('%Y-%m-%d %H:%M:%S')
            marketTran.insertTuple_one(""+tableName[i] + "(marketTime, dealPage, marketPrice, highASK, lowAsk, highBid, lowBid)",
                (timestamp, pageName[j], marketPrice, highAsk, lowAsk, highBid, lowBid), insertQuery)
            pass
        pass
    pass

def setInterval(func, sec):
    def funcWrapper():
        setInterval(func, sec)
        func()
    t = threading.Timer(sec, funcWrapper)
    t.start()
    return t

setInterval(currencyCrawler, 60)    
