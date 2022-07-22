from web3 import Web3
from eth_account import Account
from web3.middleware import geth_poa_middleware
from requests import get

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
    return {"balance" : Balance, "address" : address}
    # return str(Balance)


def prepareTransaction(wallet_payer, wallet_payee, Value):
    account_1 = wallet_payer.address
    account_2 = wallet_payee.address

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


#-------------------------------------last n transactions------------------------------------


def make_api_url(module, action, address, **kwargs):
    API_KEY = "5HFE5GJ7M91VYTAF45XKSM6X5CRZVKZIEJ"
    BASE_URL = "https://api-rinkeby.etherscan.io/api"
    url = BASE_URL + f"?module={module}&action={action}&address={address}&apikey={API_KEY}"

    for key, value in kwargs.items():
        url += f"&{key}={value}"

    return url

def hideText(text):
    return f"{text[:6]}...{text[-4:]}"

def getTransactions(wif, admin):
    from datetime import datetime
    ETHER_VALUE = 10 ** 18
    address = getWallet(wif).address
    transactions_url = make_api_url("account", "txlist", address, startblock=0, endblock=99999999, page=1, offset=10000, sort="asc")
    response = get(transactions_url)
    data = response.json()["result"]

    internal_tx_url = make_api_url("account", "txlistinternal", address, startblock=0, endblock=99999999, page=1, offset=10000, sort="asc")
    response2 = get(internal_tx_url)
    data2 = response2.json()["result"]

    data.extend(data2)
    res = []
    import json
    for transaction in data :
        fr = transaction["to"] if transaction["from"].lower() == address.lower() else transaction["from"]
        tx_hash = transaction["hash"]
        if not admin :
            fr = hideText(fr)
            tx_hash = hideText(tx_hash)

        tx = {
            "id" : tx_hash,
            "type" : "Sent" if transaction["from"].lower() == address.lower() else "Recieved",
            "from" : fr,
            "amount" : int(transaction["value"])/ETHER_VALUE,
            "date" : datetime.fromtimestamp(int(transaction["timeStamp"])),
            "status" : "Completed",
            "txuri" : f"https://rinkeby.etherscan.io/tx/{tx_hash}",
            "adduri" : f"https://rinkeby.etherscan.io/address/{fr}",
            "chain" : "Ethereum-Testnet",
        }
        res.append(tx)
    return res


# --------------------------------------Tokens--------------------------------------

def getABI(cont_address):
    api_key = "5HFE5GJ7M91VYTAF45XKSM6X5CRZVKZIEJ"
    response = get(f"https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address={cont_address}&apikey={api_key}").json()
    return response["result"]

def getTokens(wif):
    import json
    address = getWallet(wif).address
    url = f"https://deep-index.moralis.io/api/v2/{address}/erc20?chain=rinkeby"

    header = { 'X-API-Key' : 'cGGg1WebTB7vFY6jU77F7nbND6ciGWuznciXbApmtMTiFWA3vwzydNSS1AnEY7c6' }
    response = get(url,headers=header)
    data = json.loads(response.text)
    assets_data = []
    for asset in data:
        asset_data = {
            "address" : asset["token_address"],
            "name" : asset["name"],
            "symbol" : asset["symbol"],
            "balance" : int(asset["balance"]) / 10**int(asset["decimals"]),
        }
        assets_data.append(asset_data)
    return assets_data

def buildTokenTransaction(payer_wif, payee_wif, token, amount):
    payer_wallet = getWallet(payer_wif)
    payee_wallet = getWallet(payee_wif)
    amount = int(amount*10**18)
    transaction = token.functions.transfer(payee_wallet.address, amount).buildTransaction({
            'from': payer_wallet.address,
            'nonce': w3.eth.get_transaction_count(payer_wallet.address),
            'gas': 1000000,
            'gasPrice': w3.toWei("70", "gwei"),
    })
    wall_addres = Web3.toChecksumAddress(payer_wallet.address)
    signed_tx = w3.eth.account.sign_transaction(transaction, payer_wallet.privateKey)
    return signed_tx

def sendToken(payer_wif,payee_wif, address, amount):
    import json
    contract_address = Web3.toChecksumAddress(address)
    contract_abi = json.loads(getABI(address))
    token = w3.eth.contract(address=contract_address, abi=contract_abi)
    signed_tx = buildTokenTransaction(payer_wif, payee_wif, token, amount)
    txn_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    txn_receipt = w3.eth.wait_for_transaction_receipt(txn_hash)
    return txn_receipt

#----------------------------------------------- dealing with nft --------------------------------------------

def buildNFTTransaction(payer_wif, payee_wif, nft, nft_id):
    payer_wallet = getWallet(payer_wif)
    payee_wallet = getWallet(payee_wif)
    wall_address = payer_wallet.address
    wall2_address = payee_wallet.address
    nft_transaction = nft.functions.transferFrom(wall_address, wall2_address, nft_id).buildTransaction(
    {
            'from': wall_address,
            'nonce': w3.eth.get_transaction_count(wall_address),
            'gas': 1000000,
            'gasPrice': w3.toWei("70", "gwei"),
    }
    )
    nft_signed_tx = w3.eth.account.sign_transaction(nft_transaction, payer_wallet.privateKey)
    return nft_signed_tx

def sendNFT(payer_wif, payee_wif, address, nft_id):
    import json
    nft_contract_address = Web3.toChecksumAddress(address)
    nft_contract_abi = json.loads(getABI(address))
    nft = w3.eth.contract(address=nft_contract_address, abi=nft_contract_abi)
    nft_signed_tx = buildNFTTransaction(payer_wif, payee_wif, nft, nft_id)
    nft_txn_hash = w3.eth.send_raw_transaction(nft_signed_tx.rawTransaction)
    return nft_txn_hash

def getNFTs(wif) :
    import json
    address = getWallet(wif).address
    url = f"https://testnets-api.opensea.io/api/v1/assets?owner={address}&order_direction=desc&offset=0&limit=50&include_orders=false"
    response = get(url)
    data = json.loads(response.text)
    assets_data = []
    for asset in data["assets"]:
        asset_data = {
            "name" : asset["asset_contract"]["name"],
            "symbol" : asset["asset_contract"]["symbol"],
            "address" : asset["asset_contract"]["address"],
            "image_url" : asset["image_url"],
            "permalink" : asset["permalink"],
            "token_id" : asset["token_id"]
        }
        assets_data.append(asset_data)
    return assets_data