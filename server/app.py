from flask import Flask, request, session, jsonify, make_response
from flask_cors import CORS
import db
import RippleFunctions as XRP
import BitcoinFunctions as BTC
import EthereumFunctions as ETH
import random
import smtplib

u1 = "2268b31c-2239-4280-9414-e98f166c94c0"
u2 = "69906b1e-ddb4-471f-a2ee-6a435eaa879b"


application = Flask(__name__, )
application.secret_key = "cnpr9qm3yxrq3yr73r77y2m83ry293zr8y938ru"
application.config['SESSION_TYPE'] = 'filesystem'

CORS(application, supports_credentials=True)

DB, pointer = db.connectSQL()
db.createDB(pointer)

client = XRP.getTestClient()

def generateOTP(gmail):
    # create smtp session 
    s = smtplib.SMTP("smtp.gmail.com" , 587)  # 587 is a port number
    # start TLS for E-mail security 
    s.starttls()
    # Log in to your gmail account
    s.login("digitalwalletsup@gmail.com" , "fjrmciddcazmyfut")
    otp = random.randint(100000, 999999)
    msg = f'''Subject : One time password for Digital Wallet 

    Thanks for using our digital wallet. Here is your One Time Password : {otp} '''
            
    s.sendmail("digitalwalletsup@gmail.com", gmail, msg)
    # close smtp session
    s.quit()
    return otp

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@application.route("/")
def temp():
    return "Hello World"

# ----------------------------------------------------------------------------------------------------------------------
# Authentication Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@application.route("/api/auth/getUser")
def getUser():
    if request.method == "GET" :
        if session.get("uid") :
            if session.get("admin") :
                return jsonify({"user" : session["uid"], "admin" : session["admin"]}), 200
            return jsonify({"user" : session["uid"]}), 200
        else :
            return jsonify({"user" : None}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method", "user" : None}), 400

@application.route("/api/auth/login", methods = ["POST"])
def login():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        body = request.json

        try :
            username = body["username"]
        except :
            return jsonify({"message" : "Username not found", "user" : None}), 400
            
        try :
            password = body["password"]
        except :
            return jsonify({"message" : "Password not found", "user" : None}), 400

        user = db.checkLogin(pointer, username, password)
        if user :
            session["uid"] = user
            if user == u2 :
                session["admin"] = True
                session.modified = True
                return jsonify({"message" : "User logged in", "user" : user, "admin" : session["admin"]}), 200
            session.modified = True
            return jsonify({"message" : "User logged in", "user" : user}), 200
        else :
            return jsonify({"message" : "Invalid username or password", "user" : None}), 400
    else :
        return jsonify({"message" : "Unsupported Request Method", "user" : None}), 400

@application.route("/api/auth/logout")
def signout() :
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    if request.method == 'GET':
        session.pop("uid", None)
        if session.get("admin") :
            session.pop("admin", None)
        return jsonify({"message" : "User Signed Out", "user" : None}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/auth/signup", methods = ["POST"])
def signup():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    if request.method == 'POST':
        
        try : 
            username = request.json["username"]
        except :
            return jsonify({"message": "Missing username"}), 400

        try : 
            password = request.json["password"]
        except :
            return jsonify({"message": "Missing password"}), 400
        
        try : 
            recovery_password = request.json["recoveryPassword"]
        except :
            return jsonify({"message": "Missing password"}), 400
        
        # signup logic
        uid = db.addNewUser(pointer, DB, username, password, recovery_password)
        ETHwif = ETH.createWallet()
        BTCwif = BTC.createWallet()
        XRPwif = XRP.createWallet(client)
        db.addUserKeys(pointer, DB, uid, BTCwif, ETHwif, XRPwif)
        session["uid"] = uid
        session.modified = True
        return jsonify({"message" : "User added successfully", "user" : {"uid" : uid, "username" : username}}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 
        
@application.route("/api/auth/getotp", methods = ["POST"])
def getOTP():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    if request.method == 'POST':
        
        try : 
            email = request.json["email"]
        except :
            return jsonify({"message": "Missing username"}), 400
        
        session["otp"] = generateOTP(email)
        session["email"] = email
        session.modified = True
        return jsonify({"message" : "Request Recieved"}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400
        
@application.route("/api/auth/validate", methods = ["POST"])
def validateotp():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    if request.method == 'POST':
        
        try : 
            otp = request.json["otp"]
        except :
            return jsonify({"message": "Missing username"}), 400
        
        if session.get("otp") == otp :
            session.pop("otp", None)
            return jsonify({"message" : "OTP validated"}), 200
        else :
            return jsonify({"message" : "Invalid OTP"}), 400
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400
        
@application.route("/api/auth/reset", methods = ["POST"])
def resetPassword():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    if request.method == 'POST':
        
        try : 
            password = request.json["password"]
        except :
            return jsonify({"message": "Missing password"}), 400
        
        if session.get("email") :
            db.updatePassword(pointer, DB, session["email"], password)
            return jsonify({"message" : "OTP validated"}), 200
        else :
            return jsonify({"message" : "Something Went Wrong"}), 400
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


# ----------------------------------------------------------------------------------------------------------------------
# Admin Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@application.route("/api/admin/changeacc", methods = {"POST"})
def changeUser():
    if request.method == "OPTIONS" :
        return _build_cors_preflight_response()
    elif request.method == "POST" :
        try : 
            username = request.json["username"]
        except :
            return jsonify({"message": "Missing username"}), 400

        if session.get("admin") :
            uid = db.lookup(pointer, username)
            session["uid"] = uid
            return jsonify({"message" : "User changed", "user" : uid}), 200
        else :
            return jsonify({"message" : "Not Admin"}), 400
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


# ----------------------------------------------------------------------------------------------------------------------
# Wallet Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@application.route("/api/wallet/balance")
def getWalletBalance():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        if session.get("uid") :
            keys = db.getKeys(pointer, session["uid"])
            result = {
                "ETH" : ETH.getBalance(keys["ETHwif"]),
                "BTC" : BTC.getBalance(keys["BTCwif"]),
                "XRP" : XRP.getBalance(keys["XRPwif"], client),
            }
            return jsonify({"message" : "Retrieved", "result" : result}), 200
        else :
            return jsonify({"message" : "User not logged in"}), 400
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/wallet/history")
def getWalletTransaction():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        if session.get("uid") :
            keys = db.getKeys(pointer, session["uid"])
            admin = False
            if session.get("admin") :
                admin = session["admin"]
            
            result = {
                "ETH" : ETH.getTransactions(keys["ETHwif"], admin),
                "BTC" : BTC.getTransactions(keys["BTCwif"], admin),
                "XRP" : XRP.getTransactions(keys["XRPwif"], 5, client, admin),
            }
        return jsonify({"message" : "Retrieved", "result" : result}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


# ----------------------------------------------------------------------------------------------------------------------
# ETH Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@application.route("/api/eth/generate", methods = ["POST"])
def genEthWallet():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        result = {}
        body = request.json
        try :
            uid = body["uid"]
        except :
            return jsonify({"err": "Missing uid"}), 400
        # perform checks
        if loggedIn(uid) :
            # from BitcoinFunctions import createKey, getPrivateKey, getAddress, getPublicKey, getKey
            # # key = createKey()
            # key = getKey("cRUME2TmT79w6MYc21G87XoCJ2c24pXAnhii2kV7RMNtardkicW3")
            # result = {
            #     "private_key" : getPrivateKey(key),
            #     "public_key" : getPublicKey(key),
            #     "address" : getAddress(key),
            #     "wif" : key.to_wif(),
            # }
            return jsonify({"message" : "Wallet Created", "result" : result}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/eth/transfer", methods = ["POST"])
def transferEth():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':

        try : 
            to = request.json["to"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        
        try : 
            value = request.json["value"]
        except :
            return jsonify({"message": "Missing value"}), 400

        uid_payee = db.lookup(pointer, to)

        if session.get("uid") :
            mnemonic_payer = db.getETHKeys(pointer, session["uid"])
            mnemonic_payee = db.getETHKeys(pointer, uid_payee)
            tx_hash = ETH.sendTransaction(mnemonic_payer, mnemonic_payee, value)
            return jsonify({"message" : "Transaction Uploaded to Blockchain", "tx_hash" : tx_hash}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/eth/balance")
def getEthBalance():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        if session.get("uid") :
            wif = db.getETHKeys(pointer, session["uid"])
            balance = ETH.getBalance(wif)
            return jsonify({"message" : "Success", "balance" : balance}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400
    

@application.route("/api/eth/history")
def getEthHistory():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        if session.get("uid") :
            admin = False
            if session.get("admin") :
                admin = session["admin"]
            wif = db.getETHKeys(pointer, session["uid"])
            transactions = ETH.getTransactions(wif, admin)
            return jsonify({"message" : "Success", "tx_history" : transactions}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

# ----------------------------------------------------------------------------------------------------------------------
# BTC Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@application.route("/api/btc/generate", methods = ["POST"])
def genBtcWallet():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':  
        result = {}
        body = request.json
        try :
            uid = body["uid"]
        except :
            return jsonify({"err": "Missing uid"}), 400
        # perform checks
        # if loggedIn(uid) :
        #     from BitcoinFunctions import createKey, getPrivateKey, getAddress, getPublicKey
        #     key = createKey()
        #     result = {
        #         "private_key" : getPrivateKey(key),
        #         "public_key" : getPublicKey(key),
        #         "address" : getAddress(key),
        #         "wif" : key.to_wif(),
        #     }
        #     return jsonify({"message" : "Wallet Created", "result" : result}), 200
        # else :
        #     return jsonify({"message" : "User not logged in", "result" : result}), 200
    else : 
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/btc/transfer", methods = ["POST"])
def transferBtc():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':     
        try : 
            to = request.json["to"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        
        try : 
            value = request.json["value"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400

        uid_payee = db.lookup(pointer, to)

        if session.get("uid") :
            wif_payer = db.getBTCKeys(pointer, session["uid"])
            wif_payee = db.getBTCKeys(pointer, uid_payee)
            tx_hash = BTC.sendTransaction(wif_payer, wif_payee, value)
            return jsonify({"message" : "Transaction Uploaded to Blockchain", "tx_hash" : tx_hash}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/btc/balance")
def getBtcBalance():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        # Get WIF from DB
        if session.get("uid") :
            wif = db.getBTCKeys(pointer, session["uid"])
            balance = BTC.getBalance(wif)
            return jsonify({"message" : "Success", "balance" : balance}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/btc/history")
def getBtcHistory():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        # Get WIF from DB
        if session.get("uid") :
            admin = False
            if session.get("admin") :
                admin = session["admin"]
            wif = db.getBTCKeys(pointer, session["uid"])
            transactions = BTC.getTransactions(wif)
            return jsonify({"message" : "Success", "tx_history" : transactions}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

# ----------------------------------------------------------------------------------------------------------------------
# XRP Endpoints
# ----------------------------------------------------------------------------------------------------------------------
# @application.route("/api/xrp/generate")
def genXrpWallet():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        result = {}
        body = request.json
        try :
            uid = body["uid"]
        except :
            return jsonify({"err": "Missing uid"}), 400
        # perform checks
        if loggedIn(uid) :
            # key = createKey()
            # result = {
            #     "private_key" : getPrivateKey(key),
            #     "public_key" : getPublicKey(key),
            #     "address" : getAddress(key),
            #     "wif" : key.to_wif(),
            # }
            return jsonify({"message" : "Wallet Created", "result" : result}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/xrp/transfer", methods = ["POST"])
def transferXrp():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':        
        try : 
            to = request.json["to"]
        except :
            return jsonify({"message": "Missing Payee username"}), 400
        
        try : 
            value = request.json["value"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        
        uid_payee = db.lookup(pointer, to)

        if session.get("uid") :
            wif_payer = db.getXRPKeys(pointer, session["uid"])
            wif_payee = db.getXRPKeys(pointer, uid_payee)
            tx_hash = XRP.sendTransaction(wif_payer, wif_payee, value, client)
            return jsonify({"message" : "Transaction Uploaded to Blockchain", "tx_hash" : tx_hash}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/xrp/balance")
def getXrpBalance():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        # Get WIF from DB
        if session.get("uid") :
            wif = db.getXRPKeys(pointer, session["uid"])
            balance = XRP.getBalance(wif, client)
            return jsonify({"message" : "Success", "balance" : balance}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/xrp/history")
def getXrpHistory():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        # Get WIF from DB
        if session.get("uid") :
            admin = False
            if session.get("admin") :
                admin = session["admin"]
            wif = db.getXRPKeys(pointer, session["uid"])
            transactions = XRP.getTransactions(wif, 5, client, admin)
            return jsonify({"message" : "Success", "tx_history" : transactions}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


# ----------------------------------------------------------------------------------------------------------------------
# NFT Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@application.route("/api/nft/transfer", methods = ["POST"])
def transferNFT():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':        
        try : 
            to = request.json["to"]
        except :
            return jsonify({"message": "Missing Payee username"}), 400
        
        try : 
            address = request.json["address"]
        except :
            return jsonify({"message": "Missing Smart Contract Address"}), 400
        
        try : 
            id = request.json["id"]
        except :
            return jsonify({"message": "Missing NFT ID"}), 400
        
        uid_payee = db.lookup(pointer, to)

        if session.get("uid") :
            wif_payer = db.getETHKeys(pointer, session["uid"])
            wif_payee = db.getETHKeys(pointer, uid_payee)
            tx_hash = ETH.sendNFT(wif_payer, wif_payee, address, id)
            #tx_hash is in hex and is not json serializable so couldnt send back without processing
            return jsonify({"message" : "Transaction Uploaded to Blockchain"}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/nft/get")
def getNFTBalance():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        if session.get("uid") :
            wif = db.getETHKeys(pointer, session["uid"])
            NFTs = ETH.getNFTs(wif)
            return jsonify({"message" : "Success", "NFTs" : NFTs}), 200
        else :
            return jsonify({"message": "Missing uid"}), 400
        # Get WIF from DB
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/nft/history")
def getNFTHistory():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        try : 
            uid = request.json["uid"]
        except :
            return jsonify({"message": "Missing uid"}), 400
        # Get WIF from DB
        wif = db.getETHKeys(pointer, uid)
        transactions = ETH.getTransactions(wif, 5, client)
        return jsonify({"message" : "Success", "tx_history" : transactions}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


# ----------------------------------------------------------------------------------------------------------------------
# Token Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@application.route("/api/tok/transfer", methods = ["POST"])
def transferTOK():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':        
        try : 
            to = request.json["to"]
        except :
            return jsonify({"message": "Missing Payee username"}), 400
        
        try : 
            address = request.json["address"]
        except :
            return jsonify({"message": "missing Smart Contract Address"}), 400
        
        try : 
            value = request.json["value"]
        except :
            return jsonify({"message": "Missing amount"}), 400
        
        uid_payee = db.lookup(pointer, to)

        if session.get("uid") :
            wif_payer = db.getETHKeys(pointer, session["uid"])
            wif_payee = db.getETHKeys(pointer, uid_payee)
            tx_hash = ETH.sendToken(wif_payer, wif_payee, address, value)
            #tx_hash is in hex and is not json serializable so couldnt send back without processing
            return jsonify({"message" : "Transaction Uploaded to Blockchain"}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


@application.route("/api/tok/get")
def getTokenBalance():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        if session.get("uid") :
            wif = db.getETHKeys(pointer, session["uid"])
            toks = ETH.getTokens(wif)
            return jsonify({"message" : "Success", "Tokens" : toks}), 200
        else :
            return jsonify({"message": "Missing uid"}), 400
        # Get WIF from DB
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@application.route("/api/tok/history")
def getTokenHistory():
    pass


# ----------------------------------------------------------------------------------------------------------------------
# Fiat Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@application.route("/api/fiat/history")
def getFiatHistory() :
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        # Get WIF from DB
        if session.get("uid") :
            from datetime import datetime 
            transactions = [
                {
                    "tx" : 'Akk0199A999109jm01210002999',
                    "stock" : "Vanguard",
                    "qty" : 1.552,
                    "price" : 596.60,
                    "net" : 1.552 * 596.60,
                    "date" : datetime.fromtimestamp(random.randint(1655252379, 1657252379)),
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
            return jsonify({"message" : "Success", "tx_history" : transactions}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


# ----------------------------------------------------------------------------------------------------------------------
# Code Execution Starts From Here
# ----------------------------------------------------------------------------------------------------------------------
if __name__ == "__main__" :
    try :
        application.secret_key = "cnpr9qm3yxrq3yr73r77y2m83ry293zr8y938ru"
        application.config['SESSION_TYPE'] = 'filesystem'
        application.config['SESSION_COOKIE_SAMESITE'] = "None"
        application.config["SESSION_COOKIE_SECURE"] = True
        application.run()
    except Exception as e:
        DB.close()
        print(e)
        