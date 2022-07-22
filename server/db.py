def connectSQL():
	import mysql.connector
	import json
	with open("../config.json") as f:
		config = json.load(f)
	conn = mysql.connector.connect(host=config["DB_HOST"], user=config["DB_USER"], passwd=config["DB_PASSWORD"])
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

def uidToUsername(myCursor, uid) :
	myCursor.execute(f'SELECT * from LOGIN where Uid="{uid}";')
	result = myCursor.fetchone()
	return result[1]

def lookup(myCursor, username):
	# Username and type are taken as arguments
	# Type signifies the type of blockchain
	# Type can be BTC, ETH or XRP
	# The function returns the WIF of specific type
	# myCursor.execute(f'SELECT * from keydata, login where Uid=UKid and LOWER(username) LIKE LOWER("{username}");')
	myCursor.execute(f'SELECT * from LOGIN where username LIKE "{username}";')
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

def getXRPKeys(myCursor, uid) :
	myCursor.execute(f'SELECT * FROM KeyData WHERE UKid = "{uid}";')
	result = myCursor.fetchone()
	return result[3]

if __name__=="__main__":
	print("This is a module")
