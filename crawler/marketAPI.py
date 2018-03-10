import requests
import json
import sys
from xcoin_api_client import *
import pprint
import mysql.connector
import time

api_key = "api_connect_key"
api_secret = "api_secret_key"
api = XCoinAPI(api_key, api_secret)

class marketAPI:
    def requestAPI(self, marketName, selectedMarket, num):  # request Korbit API

        if marketName == "KBT":
            params = (
                ('currency_pair', selectedMarket),  # To set parameter for request.get
            )
            if num == 1:  # can get marketPrice
                info = requests.get('https://api.korbit.co.kr/v1/ticker/detailed', params=params)  # can get marketPrice
                return info

            elif num == 2:  # can get bid and ask
                info = requests.get('https://api.korbit.co.kr/v1/orderbook', params=params)  # can get marketPrice
                return info

        elif marketName == "CNN":
            params = (
                ('currency', selectedMarket),  # To set parameter for request.get
            )

            if num == 1:  # can get marketPrice
                info = requests.get('https://api.coinone.co.kr/ticker', params=params)  # can get marketPrice
                return info

            elif num == 2:  # can get bid and ask
                info = requests.get('https://api.coinone.co.kr/orderbook', params=params)  # can get marketPrice
                return info

        elif marketName == "BTH":
            query2 = "https://api.bithumb.com/public/orderbook/"+selectedMarket
            info = requests.get(query2, params=selectedMarket) # To get info from Korbit API
            return info

    def getmarketPriceData(self, marketName, selectedMarket):
        if marketName == "KBT":
            info = self.requestAPI(marketName, selectedMarket, 1)
            dict = json.loads(info.text)
            marketPrice = dict['last']

        elif marketName == "CNN":
            info = self.requestAPI(marketName, selectedMarket, 1)
            dict = json.loads(info.text)
            marketPrice = dict['last']

        elif marketName == "BTH":
            rgParams = {"order_currency" : selectedMarket, "payment_currency" : "KRW"}
            query = "/public/ticker/" + selectedMarket
            result = api.xcoinApiCall(query, rgParams)
            marketPrice = result["data"]["average_price"]

        return marketPrice

    def gethighAsk(self, marketName, selectedMarket):
        if marketName == "KBT":
            info = self.requestAPI(marketName, selectedMarket, 2)
            dict = json.loads(info.text)
            asks = dict['asks']
            return asks[len(asks) - 1][0]

        elif marketName == "CNN":
            info = self.requestAPI(marketName, selectedMarket, 2)
            dict = json.loads(info.text)
            asks = dict['ask']
            return asks[len(asks) - 1]['price']

        elif marketName == "BTH":
            info = self.requestAPI(marketName, selectedMarket, 0)
            dict = json.loads(info.text)
            asks = dict['data']['asks']
            return asks[19]["price"]

    def getlowAsk(self, marketName, selectedMarket):
        if marketName == "KBT":
            info = self.requestAPI(marketName, selectedMarket, 2)
            dict = json.loads(info.text)
            asks = dict['asks']
            return asks[0][0]

        elif marketName == "CNN":
            info = self.requestAPI(marketName, selectedMarket, 2)
            dict = json.loads(info.text)
            asks = dict['ask']
            return asks[0]['price']

        elif marketName == "BTH":
            info = self.requestAPI(marketName, selectedMarket, 0)
            dict = json.loads(info.text)
            asks = dict['data']['asks']
            return asks[0]["price"]

    def gethighBid(self, marketName, selectedMarket):
        if marketName == "KBT":
            info = self.requestAPI(marketName, selectedMarket, 2)
            dict = json.loads(info.text)
            bids = dict['bids']
            return bids[0][0]

        elif marketName == "CNN":
            info = self.requestAPI(marketName, selectedMarket, 2)
            dict = json.loads(info.text)
            bids = dict['bid']
            return bids[0]['price']

        elif marketName == "BTH":
            info = self.requestAPI(marketName, selectedMarket, 0)
            dict = json.loads(info.text)
            bids = dict['data']['bids']
            return bids[0]["price"]


    def getlowBid(self, marketName, selectedMarket):
        if marketName == "KBT":
            info = self.requestAPI(marketName, selectedMarket, 2)
            dict = json.loads(info.text)
            asks = dict['bids']
            return asks[len(asks) - 1][0]

        elif marketName == "CNN":
            info = self.requestAPI(marketName, selectedMarket, 2)
            dict = json.loads(info.text)
            asks = dict['bid']
            return asks[len(asks) - 1]['price']

        elif marketName == "BTH":
            info = self.requestAPI(marketName, selectedMarket, 0)
            dict = json.loads(info.text)
            bids = dict['data']['bids']
            return bids[19]["price"]