import mysql.connector
import datetime
from config import config

class market_transaction:
    def __init__(self):
        self.configuration = config()
        self.connection = mysql.connector.connect(user=self.configuration.getdbUser(), password=self.configuration.getdbPassword(),
                                             host=self.configuration.getdbHost())
        if self.connection.is_connected():
            print('Connected to MYSQL database')

        self.cur = self.connection.cursor()
        self.checkoutDB(self.configuration.getdbName())

    def FKCheckChange(self, status):
        query = 'set foreign_key_checks={}'.format(status)
        self.cur.execute(query)
        pass

    def checkoutDB(self, dbName):
        self.cur.execute('use {}'.format(dbName))
        pass

    def insertData(self, table, data, insertQuery):
        self.FKCheckChange(0)
        query = ('insert into {} values '.format(table) + insertQuery)
        print(query)
        self.cur.executemany(query, data)
        self.FKCheckChange(1)
        pass

    def insertTuple_one(self, table, data, insertQuery):

        self.FKCheckChange(0)
        query = ('insert into {} values '.format(table) + insertQuery)
        self.cur.execute(query, data)
        self.commitChange()
        self.FKCheckChange(1)
        pass

    def getData(self,table, attributes, toget):
        query=('select {} from {} '.format(attributes,table)+
               "Where {}".format(toget))
        self.cur.execute(query)

        return_data=[]
        for data in self.cur:
            return_data.append(data)
        return return_data

    def queryData(self, table,supplement):
        query = ('select * from {} '.format(table)+supplement)
        self.cur.execute(query)

        print ("[Result of Table '{}']".format(table))
        formatter = None
        print(self.cur.column_names)
        for data in self.cur:
            if formatter == None:
                formatter = "%s"
                for i in range(len(data)-1):
                    formatter += "\t\t%s"
            print (formatter % data)
            pass
        print
        pass

    def updateData(self, table, supplement):
        query = ('update {} '.format(table) + supplement)
        self.cur.execute(query)
        return self.cur

    def deleteData(self, table, supplement):
        query = ('delete from {}'.format(table) + supplement)
        self.cur.execute(query)
        self.commitChange()

    def commitChange(self):
        self.connection.commit()
        pass

    def endConnection(self):
        self.cur.close()
        self.connection.close()
        pass

    def queryData_person(self, time, time2, tableName):
        supplement = "marketTime < '" + time.strftime("%Y-%m-%d %H:%M:%S") + "' and marketTime > '" + time2.strftime("%Y-%m-%d %H:%M:%S") + "'"
        query= ('select dealPage, highAsk, lowBid from {} where '.format(tableName)+supplement)
        self.cur.execute(query)
        data = self.cur.fetchall()
        # index [][0] == 'dealPage' , [][1] == 'highAsk', [][2] == 'lowBid'
        for row in data :
            print(row)
        temp =[]
        ids = []
        for row in data :
            query = ("select id from notifyMarket where currency = '" + tableName[6:9] + "' and deal = 'ASK' and threshold * 0.9 < " + str(row[2]) + " and threshold * 1.1 > " + str(row[2]) + "")
            self.cur.execute(query)
            ASK = self.cur.fetchall()
            if len(ASK)==0:
                pass
            else:
                i=0
                while i!=len(ASK):
                    if len(ids) == 0 or ASK[i][0] not in ids:
                        ids.append(ASK[i][0])
                        temp.append({'id':ASK[i][0], 'rate' : row[2], 'page' : row[0]})
                        pass
                    else:
                        for j in range(len(ids)):
                            if ASK[i][0] == ids[j]:
                                if row[1] < temp[j]['rate']:
                                    temp[j]['rate'] = row[2]
                                    temp[j]['page'] = row[0]
                                    break
                    i=i+1

        for row in data :
            query = ("select id from notifyMarket where currency = '" + tableName[6:9] + "' and deal = 'BID' and threshold * 0.9 <" + str(row[1]) + " and threshold * 1.1 > " + str(
                row[1]) + "")
            self.cur.execute(query)
            BID = self.cur.fetchall()

            if len(BID) == 0:
                pass
            else:
                i=0
                while i!=len(BID):
                    if len(ids) == 0 or BID[i][0] not in ids:
                        ids.append(BID[i][0])
                        temp.append({'id':BID[i][0], 'rate' : row[1], 'page' : row[0]})
                        pass
                    else:
                        for j in range(len(ids)):
                            if BID[i][0] == ids[j]:
                                if row[1] > temp[j]['rate']:
                                    temp[j]['rate'] = row[1]
                                    temp[j]['page'] = row[0]
                                    break


                    i=i+1

        print(temp)
        return temp

