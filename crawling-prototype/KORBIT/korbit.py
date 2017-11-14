from selenium import webdriver

driver = webdriver.Chrome('/Users/KimHeeYeon/Documents/DB/chromedriver')

driver.implicitly_wait(3)

driver.get('https://www.bithumb.com')

driver.implicitly_wait(5)

# get every contents that have name 'tbody'
result = driver.find_elements_by_tag_name('tbody')

# split text by '\n'
result2 = result[0].text.split('\n')


count = 1

for val in result2 :
    # print val

    # even index has variation and the rates of variation and etc.
    if count%2 == 0:
        # when split the 'val' by ' ', the first index of splitted val is variation
        temp = val.split(' ')
        print 'variation : ' + temp[0] + '\n'
    else:
        # odd index have the name of coins and the price of coints and won
        val2 = val.split(' ')

        # print val2

        # when split the val, the last index is won. and the 2nd last index is the price and the others are the name.
        # we don't get 'won'
        array2 = val2[-2::-1]

        # print array2
        # the first one is price. and the second trough last is the name of coins but the order is backward
        price = array2[0]

        # because the order is backward and the first index is price, get names.
        name = array2[-1:0:-1]

        name = " ".join(name)
        print 'name : ' + name
        print 'price : ' + price

    count += 1