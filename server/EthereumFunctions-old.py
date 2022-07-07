from web3 import Web3
from eth_account import Account
from web3.middleware import geth_poa_middleware
import json
from requests import get
from datetime import datetime

w3 = Web3(Web3.HTTPProvider('https://rinkeby.infura.io/v3/cc18e8d5fdf44009911e07cdbb195f5b'))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

#create an account....
def createWallet():
    Account.enable_unaudited_hdwallet_features()
    acct, mnemonic = Account.create_with_mnemonic()
    return mnemonic

def getWallet(mnemonic):
    Account.enable_unaudited_hdwallet_features()
    account = w3.eth.account.from_mnemonic(mnemonic)
    return account

#fetching account balance and 
def getBalance(mnemonic):
    account = getWallet(mnemonic)
    address = account.address
    ETHER_VALUE = 10 ** 18
    Balance = w3.eth.get_balance(address)/ ETHER_VALUE
    return str(Balance)

def prepareTransaction(wallet_payer, wallet_payee, Value):
    # wallet = getWallet(mnemonic)
    account_1 = wallet_payer.address
    account_2 = wallet_payee.address

    # get the nonce.  Prevents one from sending the transaction twice
    # nonce = w3.eth.getTransactionCount(account_1)

    nonce = w3.eth.getTransactionCount(account_1)
    tx = {
         'nonce': nonce,
         'to': account_2,
         'value': w3.toWei(Value, 'ether'),
         'gas': 2000000,
         'gasPrice': w3.toWei('5', 'gwei')
    }
    return tx


#sign the transaction
def signTransaction(wallet_payer, wallet_payee, Value):
    tx = prepareTransaction(wallet_payer, wallet_payee, Value)
    private_key1 = wallet_payer.privateKey.hex()
    signed_tx = w3.eth.account.sign_transaction(tx, private_key1)
    return signed_tx

def sendTransaction(mnemonic_payer, mnemonic_payee, Value):
    wallet_payer = getWallet(mnemonic_payer)
    wallet_payee = getWallet(mnemonic_payee)
    signed_tx = signTransaction(wallet_payer, wallet_payee, Value)
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    trans_hash = w3.toHex(tx_hash)
    return trans_hash

# mnemonic = create_wallet()
# wallet,Address,PrivateKey = get_wallet(mnemonic)
# Balance = get_balance(Address)
# Account_2 = '0x02ccCed7A30f961F22FB4e71669E50CAd386D4f0'
# Value =  0.00000001
# Tx = preparing_transaction(wallet,Account_2,Value)
# Signed_tx = sign_transaction(Tx,wallet)
# Trans_hash = Send_transaction(Signed_tx)

#-------------------------------------last n transactions------------------------------------


# address= Address

ETHER_VALUE = 10 ** 18

def make_api_url(module, action, address, **kwargs):
    API_KEY = "5HFE5GJ7M91VYTAF45XKSM6X5CRZVKZIEJ"
    BASE_URL = "https://api-rinkeby.etherscan.io/api"
    url = BASE_URL + f"?module={module}&action={action}&address={address}&apikey={API_KEY}"

    for key, value in kwargs.items():
        url += f"&{key}={value}"

    return url

def getTransactions(wif):
    address = getWallet(wif).address
    transactions_url = make_api_url("account", "txlist", address, startblock=0, endblock=99999999, page=1, offset=10000, sort="asc")
    response = get(transactions_url)
    data = response.json()["result"]

    internal_tx_url = make_api_url("account", "txlistinternal", address, startblock=0, endblock=99999999, page=1, offset=10000, sort="asc")
    response2 = get(internal_tx_url)
    data2 = response2.json()["result"]

    data.extend(data2)
    data.sort(key=lambda x: int(x['timeStamp']))

    current_balance = 0
    balances = []
    times = []

    for tx in data:
        to = tx["to"]
        from_addr = tx["from"]
        value = int(tx["value"]) / ETHER_VALUE
        if "gasPrice" in tx:
            gas = int(tx["gasUsed"]) * int(tx["gasPrice"]) / ETHER_VALUE
            print("Gas_Price", gas)
        else:
            gas = int(tx["gasUsed"]) / ETHER_VALUE
            print("gas used :",gas) 
        time = datetime.fromtimestamp(int(tx['timeStamp']))
        money_in = to.lower() == address.lower()

        if money_in:
            current_balance += value
        else:
            current_balance -= value + gas

        balances.append(current_balance)
        times.append(time)

# --------------------------------------Tokens--------------------------------------

# def getToken():
#     a = input("Enter your token name: ")
#     print('Token Name :', a)

#     data = {}

#     with open("ayush.tsv", "r") as f:
#         lines = f.readlines()
#         for line in lines :
#             t = line.split('\t')
#             temp = {}
#             name = t[0]
#             temp["address"] = t[1]
#             temp["abi"] = t[2]
#             data[name] = temp

#     contract_address = Web3.toChecksumAddress(data[a]["address"])
#     contract_abi = json.loads(data[a]["abi"])
#     token = w3.eth.contract(address=contract_address, abi=contract_abi) 
#     tokens_address = token.address
#     return contract_address,contract_abi,tokens_address,token


# def getTokenBalance(wall_address):
#     wall_addres = Web3.toChecksumAddress(wall_addres)
#     token_balance = token.functions.balanceOf(wall_addres).call() # returns int with balance, without decimals
#     print('Token Balance for wallet 1 :', token_balance)


# def buildTransaction(wall_address,wall2_address,private_key,token):
#     transaction = token.functions.transfer(wall2_address, 1).buildTransaction()
#     wall_addres = Web3.toChecksumAddress(wall_addres)
#     transaction.update({ 'gas' : 70000 })
#     transaction.update({ 'nonce' : w3.eth.get_transaction_count(wall_addres) })
#     signed_tx = w3.eth.account.sign_transaction(transaction, private_key)
#     return signed_tx


# def sendTransaction(signed_tx):
#     #And finally, send the transaction
#     txn_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
#     txn_receipt = w3.eth.wait_for_transaction_receipt(txn_hash)
#     print('Transaction receipt : ',txn_receipt)

if __name__ == "__main__" :
    wallet = getWallet("credit receive wear sting plate quarter age impulse produce sting glue suspect")
    print(wallet.address)

# contract_address,contract_abi,token_address,token = get_token()
# # Address =  '0x01Be0A95b30ec54Cc7333D4f3e310B494CE98576'
# PrivateKey =  '0x672bacaf4fcf2a6357e3caa5c419b1a403fece46e16a5e1bf1d0c2b2b45bc1f5'
# get_token_balance(Address)
# Account_2 = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'
# signed_tx = build_transaction(Address,Account_2,PrivateKey,token)
# send_transaction(signed_tx)