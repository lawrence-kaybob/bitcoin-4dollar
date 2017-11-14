# The code to get currency price and variation from 'KORBIT'

import requests

standard_List = ['bch_krw', 'btc_krw', 'eth_krw', 'etc_krw', 'xrp_krw'] # list of currency
                # bitcoin_cash , bitcoin, ethereum, ethereum_classic, Ripple

#The way to get currency price and variation
for i in range(0, 5):
    params = (
        ('currency_pair', standard_List[i] ), # To set parameter for request.get
    )
    print(standard_List[i])

    info = requests.get('https://api.korbit.co.kr/v1/ticker/detailed', params=params) # To get info from Korbit API
    info_text = info.text.replace(",", ":")
    info_split = info_text.split(":")  # Spliting info to get some info I want ( currentc_price, lowest and highest price in 24hr

    last_name = info_split[2]   # 'last' : current price
    low_name = info_split[8]    # 'low'  : lowest price in 24hr
    high_name = info_split[10]  # 'high' : highest price in 24hr

    last = info_split[3]       # value of last
    low = info_split[9]        # value of low
    high = info_split[11]      # value of high

    print(last_name+": "+last)
    print(low_name+": "+low)
    print(high_name+": "+high)
    print(" ")