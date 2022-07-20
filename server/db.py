def connectSQL():
	import mysql.connector
	conn = mysql.connector.connect(host="localhost", user="root", passwd="manarises")
	cursor = conn.cursor()
	cursor.execute("CREATE DATABASE IF NOT EXISTS FIL_WALLET;")
	cursor.execute("USE FIL_WALLET;")
	return conn, cursor

def createDB(myCursor):  

	myCursor.execute('''CREATE TABLE IF NOT EXISTS LOGIN(
		Uid varchar(64) NOT NULL,
		Username varchar(45) NOT NULL,
		Password varchar(45) NOT NULL,
		Email varchar(45) NOT NULL,
		PRIMARY KEY (Uid),
		UNIQUE KEY Uid_UNIQUE (Uid),
		UNIQUE KEY Username_UNIQUE (Username)
	);''')

	myCursor.execute('''CREATE TABLE IF NOT EXISTS KeyData(
		UKid varchar(64) NOT NULL,
		btcWif varchar(128) NOT NULL,
		ethWif varchar(128) NOT NULL,
		xrpWif varchar(128) NOT NULL,
		PRIMARY KEY (UKid),
		UNIQUE KEY UKid_UNIQUE (UKid),
		UNIQUE KEY btcWif_UNIQUE (btcWif),
		UNIQUE KEY ethWif_UNIQUE (ethWif),
		UNIQUE KEY xrpWif_UNIQUE (xrpWif)
	);''')

def addNewUser(myCursor, conn, username, password, email="akash7890123@gmail.com"):
	from uuid import uuid4
	uid = str(uuid4())
	myCursor.execute(f'INSERT INTO LOGIN VALUES("{uid}", "{username}", "{password}", "{email}");')
	conn.commit()
	return uid

def checkLogin(myCursor, username, password):
	myCursor.execute(f'SELECT * FROM LOGIN WHERE Username="{username}" AND Password="{password}"')
	res = myCursor.fetchone()
	if res is not None:
		return res[0]
		# return {
		# "uid" : res[0],
		# "username" : res[1],
		# }
	else:
		return None

def updatePassword(MyCursor, conn, email, newPassword):
	MyCursor.execute(f'UPDATE LOGIN SET Password="{newPassword}" where Email="{email}";')
	conn.commit()

def checkUser(myCursor, username):
  myCursor.execute(f'SELECT * FROM LOGIN WHERE Username="{username}";')
  if myCursor.fetchone():
    return True
  return False

def checkPassword(myCursor, username, password):
  myCursor.execute(f'SELECT * FROM LOGIN WHERE Username="{username}" and Password="{password}";')
  if myCursor.fetchone():
    return True
  return False

def addUserKeys(myCursor, conn, uid, BTCwif, ETHwif, XRPwif) :
	myCursor.execute(f'INSERT INTO KeyData VALUES("{uid}", "{BTCwif}", "{ETHwif}", "{XRPwif}");')
	conn.commit()

def usernameToMail(myCursor, username):
	myCursor.execute(f'SELECT Email FROM LOGIN WHERE Username="{username}";')
	result = myCursor.fetchone()
	return result[-1]

def lookup(myCursor, username):
	# Username and type are taken as arguments
	# Type signifies the type of blockchain
	# Type can be BTC, ETH or XRP
	# The function returns the WIF of specific type
	# myCursor.execute(f'SELECT * from keydata, login where Uid=UKid and LOWER(username) LIKE LOWER("{username}");')
	myCursor.execute(f'SELECT * from KeyData, login where Uid=UKid and username LIKE "{username}";')
	result = myCursor.fetchone()
	return result[0]

def getKeys(myCursor, uid) :
	myCursor.execute(f'SELECT * FROM KeyData WHERE UKid = "{uid}";')
	result = myCursor.fetchone()
	data = {
		"BTCwif" : result[1],
		"ETHwif" : result[2],
		"XRPwif" : result[3],
	}
	return data

def getBTCKeys(myCursor, uid) :
	myCursor.execute(f'SELECT * FROM KeyData WHERE UKid = "{uid}";')
	result = myCursor.fetchone()
	return  result[1]

def getETHKeys(myCursor, uid) :
	myCursor.execute(f'SELECT * FROM KeyData WHERE UKid = "{uid}";')
	result = myCursor.fetchone()
	return result[2]

def getStockName(stockId):
	myCursor, conn = connectSQL()
	myCursor.execute(f'SELECT stockName FROM StockData WHERE stockId="{stockId}";')
	res = myCursor.fetchone()
	conn.close()
    
	str = ''
	for item in res:
		str = str + item
    
	return str

def getXRPKeys(myCursor, uid) :
	myCursor.execute(f'SELECT * FROM KeyData WHERE UKid = "{uid}";')
	result = myCursor.fetchone()
	return result[3]

def getFIATTransactions():
	from datetime import datetime
	import random
	transactions = [
		{
			"id" : 'Akk0199A999109jm01210002999',
			"type" : "Vanguard",
			"from" : 1.552,
			"amount" : 596.60,
			"date" : 1.552 * 596.60,
			"status" : datetime.fromtimestamp(random.randint(1655252379, 1657252379)),
		},
		{
			"tx" : 'Akk01991gm231823h1iu2jm01210002999',
			"stock" : "Fund-Smith",
			"qty" : 1.552,
			"price" : 596.60,
			"net" : 1.552 * 596.60,
			"date" : datetime.fromtimestamp(random.randint(1655252379, 1657252379)),
		},
		{
			"tx" : 'Akk023m1u2h312uh3123mu1201923h12999',
			"stock" : "Vanguard",
			"qty" : 1.552,
			"price" : 596.60,
			"net" : 1.552 * 596.60,
			"date" : datetime.fromtimestamp(random.randint(1655252379, 1657252379)),
		},
		{
			"tx" : 'A312mu3192u3h1293j1i23999109jm01210002999',
			"stock" : "Fund-Smith",
			"qty" : 1.552,
			"price" : 596.60,
			"net" : 1.552 * 596.60,
			"date" : datetime.fromtimestamp(random.randint(1655252379, 1657252379)),
		},
	]
	return transactions

# def getFIATTransactions(userId):
#     myCursor, conn = connectSQL()
#     myCursor.execute(f'SELECT transactionId, stockId, Quantity, price, transactionTime, action FROM Transactions WHERE userId="{userId}";')
#     res = myCursor.fetchall()
#     print(res)
#     conn.close()
#     print(res)
#     lst_main=[]
#     for x in res:
#         lsst=[]
#         for index,value in enumerate(x):
#             if index==0:
#                 lsst.append(value)
#             if index==1 :
#                 a=getStockName(value)
#                 lsst.append(a)
#             if index==2 :
#                 lsst.append(value)
#             if index == 3:
#                 lsst.append(value)
#                 z=x[2] *x[3]
#                 lsst.append(z)
                
#             if index==4:
#                 lsst.append(value)
                
#             if index==5:
#                 lsst.append(value)

                
#         lst_main.append(lsst)      
# #     print(lst_main)
#     return lst_main

if __name__=="__main__":
	pass
	# myCursor, conn = connectSQL()
	# myCursor.execute(f'INSERT INTO keyData VALUES("test-kid", "65228210-24ca-4cd3-b806-0488b41345a5", "BTC", "test-wif", "test-public", "test-private", "test-add");')
	# conn.commit()
	# conn.close()
	# print(getPrivateKey("65228210-24ca-4cd3-b806-0488b41345a5", "BTC"))
	# print(getAddress("65228210-24ca-4cd3-b806-0488b41345a5", "BTC"))
	# print(getPublicKey("65228210-24ca-4cd3-b806-0488b41345a5", "BTC"))
