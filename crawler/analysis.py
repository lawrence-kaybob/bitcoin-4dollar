#!/usr/bin/python
#-*- coding: utf-8 -*-
from market_tras import market_transaction

import datetime
import requests
import json

marketTran = market_transaction()
URL = 'https://b4d.lkaybob.pe.kr:3978/api/notifyListener'
# URL = 'http://86a8b840.ngrok.io/api/notifyListener'

pageName = ['KBT', 'CNN', 'BTH']
tableName=['marketBCH', 'marketBTC', 'marketETH', 'marketETC', 'marketXRP']
standard_List_C = ['bch', 'btc', 'eth', 'etc', 'xrp']
standard_List_K = ['bch_krw', 'btc_krw', 'eth_krw', 'etc_krw', 'xrp_krw']
standard_List_B = ['BCH', 'BTC', 'ETH', 'ETC', 'XRP']
insertQuery = ('(%s, %s, %s, %s, %s, %s, %s)')

now = datetime.datetime.now() - datetime.timedelta(minutes=1)
now2 = datetime.datetime.now() - datetime.timedelta(minutes=2)

total_data = []

for i in range(len(standard_List_K)):
    data = marketTran.queryData_person(now, now2, tableName[i])
    total_data += data
    print(data)
    # if len(data)==0:
    #     print("pass")
    #     pass
    # else:
    #     res = requests.post(URL, data=send_data)

send_data = {'id': json.dumps(total_data)}
res = requests.post(URL, data=send_data)
