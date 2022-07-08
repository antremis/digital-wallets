from flask import Flask, request, session, jsonify, make_response
from flask_cors import CORS
from flask_session import Session
import db
import RippleFunctions as XRP
import BitcoinFunctions as BTC
import EthereumFunctions as ETH
import random
import smtplib

u1 = "2268b31c-2239-4280-9414-e98f166c94c0"
u2 = "69906b1e-ddb4-471f-a2ee-6a435eaa879b"

app = Flask(__name__, )

CORS(app, supports_credentials=True)
# server_session = Session()
# logged_in_users = []

# def loggedIn(uid) :
#     if uid in logged_in_users :
#         return True
#     else :
#         return False

DB, pointer = db.connectSQL()
db.createDB(pointer)

client = XRP.getTestClient()
NFTs = ETH.getNFTs()
TOKENS = ETH.getTokens()

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

@app.route("/")
def temp():
    return "Hello World"

# ----------------------------------------------------------------------------------------------------------------------
# Authentication Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@app.route("/api/auth/getUser")
def getUser():
    if request.method == "GET" :
        if session.get("uid") :
            return jsonify({"user" : session["uid"]}), 200
        else :
            return jsonify({"user" : None}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method", "user" : None}), 400

@app.route("/api/auth/login", methods = ["POST"])
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
            session.modified = True
            return jsonify({"message" : "User logged in", "user" : user}), 200
            # Logic
            # uid -> unique user ID
            # if user["uid"] not in logged_in_users :
            #     logged_in_users.append(user["uid"])
            #     return jsonify({"message" : "User logged in", "user" : user}), 200
            # else :
            #     return jsonify({"message" : "User Already Logged In", "user" : user}), 200
        else :
            return jsonify({"message" : "Invalid username or password", "user" : None}), 400
    else :
        return jsonify({"message" : "Unsupported Request Method", "user" : None}), 400

@app.route("/api/auth/logout")
def signout() :
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    if request.method == 'GET':
        session.pop("uid", None)
        return jsonify({"message" : "User Signed Out", "user" : None}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@app.route("/api/auth/signup", methods = ["POST"])
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
        
        # signup logic
        uid = db.addNewUser(pointer, DB, username, password)
        ETHwif = ETH.createWallet()
        BTCwif = BTC.createWallet()
        XRPwif = XRP.createWallet(client)
        db.addUserKeys(pointer, DB, uid, BTCwif, ETHwif, XRPwif)
        session["uid"] = uid
        session.modified = True
        return jsonify({"message" : "User added successfully", "user" : {"uid" : uid, "username" : username}}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 
        
@app.route("/api/auth/getotp", methods = ["POST"])
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
        
@app.route("/api/auth/validate", methods = ["POST"])
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
        
@app.route("/api/auth/reset", methods = ["POST"])
def resetPassword():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    if request.method == 'POST':
        
        try : 
            password = request.json["password"]
        except :
            return jsonify({"message": "Missing username"}), 400
        
        if session.get("email") :
            db.updatePassword(pointer, DB, session["email"], password)
            return jsonify({"message" : "OTP validated"}), 200
        else :
            return jsonify({"message" : "Something Went Wrong"}), 400
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

# ----------------------------------------------------------------------------------------------------------------------
# Wallet Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@app.route("/api/wallet/balance")
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

@app.route("/api/wallet/history")
def getWalletTransaction():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        if session.get("uid") :
            keys = db.getKeys(pointer, session["uid"])
            result = {
                "ETH" : ETH.getTransactions(keys["ETHwif"]),
                "BTC" : BTC.getTransactions(keys["BTCwif"]),
                "XRP" : XRP.getTransactions(keys["XRPwif"], 5, client),
            }
        return jsonify({"message" : "Retrieved", "result" : result}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


# ----------------------------------------------------------------------------------------------------------------------
# ETH Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@app.route("/api/eth/generate", methods = ["POST"])
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

@app.route("/api/eth/transfer", methods = ["POST"])
def transferEth():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':

        try : 
            uid_payee = request.json["uid_payee"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        
        try : 
            value = request.json["value"]
        except :
            return jsonify({"message": "Missing value"}), 400

        if session.get("uid") :
            mnemonic_payer = db.getETHKeys(pointer, session["uid"])
            mnemonic_payee = db.getETHKeys(pointer, uid_payee)
            tx_hash = ETH.sendTransaction(mnemonic_payer, mnemonic_payee, value)
            return jsonify({"message" : "Transaction Uploaded to Blockchain", "tx_hash" : tx_hash}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@app.route("/api/eth/balance")
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
    

@app.route("/api/eth/history")
def getEthHistory():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        if session.get("uid") :
            wif = db.getETHKeys(pointer, session["uid"])
            transactions = ETH.getTransactions(wif)
            return jsonify({"message" : "Success", "tx_history" : transactions}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

# ----------------------------------------------------------------------------------------------------------------------
# BTC Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@app.route("/api/btc/generate", methods = ["POST"])
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

@app.route("/api/btc/transfer", methods = ["POST"])
def transferBtc():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':     
        try : 
            uid_payee = request.json["uid_payee"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        
        try : 
            value = request.json["value"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400

        if session.get("uid") :
            wif_payer = db.getBTCKeys(pointer, session["uid"])
            wif_payee = db.getBTCKeys(pointer, uid_payee)
            tx_hash = BTC.sendTransaction(wif_payer, wif_payee, value)
            return jsonify({"message" : "Transaction Uploaded to Blockchain", "tx_hash" : tx_hash}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@app.route("/api/btc/balance")
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

@app.route("/api/btc/history")
def getBtcHistory():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        # Get WIF from DB
        if session.get("uid") :
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
# @app.route("/api/xrp/generate")
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

@app.route("/api/xrp/transfer", methods = ["POST"])
def transferXrp():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':        
        try : 
            uid_payee = request.json["uid_payee"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        
        try : 
            value = request.json["value"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        if session.get("uid") :
            wif_payer = db.getXRPKeys(pointer, session["uid"])
            wif_payee = db.getXRPKeys(pointer, uid_payee)
            tx_hash = XRP.sendTransaction(wif_payer, wif_payee, value, client)
            return jsonify({"message" : "Transaction Uploaded to Blockchain", "tx_hash" : tx_hash}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@app.route("/api/xrp/balance")
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

@app.route("/api/xrp/history")
def getXrpHistory():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'GET':
        # Get WIF from DB
        if session.get("uid") :
            wif = db.getXRPKeys(pointer, session["uid"])
            transactions = XRP.getTransactions(wif, 5, client)
            return jsonify({"message" : "Success", "tx_history" : transactions}), 200
        else :
            return jsonify({"message" : "No User logged in"}), 403
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400


# ----------------------------------------------------------------------------------------------------------------------
# NFT Endpoints
# ----------------------------------------------------------------------------------------------------------------------
@app.route("/api/nft/transfer")
def transferNFT():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        try : 
            uid_payer = request.json["uid_payer"]
        except :
            return jsonify({"message": "Missing Payer uid"}), 400
        
        try : 
            uid_payee = request.json["uid_payee"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        
        try : 
            id = request.json["id"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400

        wif_payer = db.getETHKeys(pointer, uid_payer)
        wif_payee = db.getETHKeys(pointer, uid_payee)
        tx_hash = ETH.sendNFT(wif_payer, wif_payee, NFTs, id)
        return jsonify({"message" : "Transaction Uploaded to Blockchain", "tx_hash" : tx_hash}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@app.route("/api/nft/balance")
def getNFTBalance():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        try : 
            uid = request.json["uid"]
        except :
            return jsonify({"message": "Missing uid"}), 400
        # Get WIF from DB
        wif = db.getETHKeys(pointer, uid)
        balance = ETH.getNFTBalance(wif, NFTs)
        return jsonify({"message" : "Success", "balance" : balance}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@app.route("/api/nft/history")
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
@app.route("/api/tok/transfer")
def transferToken():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        try : 
            uid_payer = request.json["uid_payer"]
        except :
            return jsonify({"message": "Missing Payer uid"}), 400
        
        try : 
            uid_payee = request.json["uid_payee"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400
        
        try : 
            value = request.json["value"]
        except :
            return jsonify({"message": "Missing Payee uid"}), 400

        wif_payer = db.getETHKeys(pointer, uid_payer)
        wif_payee = db.getETHKeys(pointer, uid_payee)
        tx_hash = ETH.transferToken(wif_payer, wif_payee, TOKENS, value)
        return jsonify({"message" : "Transaction Uploaded to Blockchain", "tx_hash" : tx_hash}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@app.route("/api/tok/balance")
def getTokenBalance():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    elif request.method == 'POST':
        try : 
            uid = request.json["uid"]
        except :
            return jsonify({"message": "Missing uid"}), 400
        # Get WIF from DB
        wif = db.getETHKeys(pointer, uid)
        balance = ETH.getTokenBalance(wif, TOKENS)
        return jsonify({"message" : "Success", "balance" : balance}), 200
    else :
        return jsonify({"message" : "Unsupported Request Method"}), 400

@app.route("/api/tok/history")
def getTokenHistory():
    pass


# ----------------------------------------------------------------------------------------------------------------------
# Code Execution Starts From Here
# ----------------------------------------------------------------------------------------------------------------------
if __name__ == "__main__" :
    try :
        app.secret_key = "cnpr9qm3yxrq3yr73r77y2m83ry293zr8y938ru"
        app.config['SESSION_TYPE'] = 'filesystem'
        app.config['SESSION_COOKIE_SAMESITE'] = "None"
        app.config["SESSION_COOKIE_SECURE"] = True
        # server_session.init_app(app)
        app.run()
    except:
        pass
    finally:
        DB.close()
        