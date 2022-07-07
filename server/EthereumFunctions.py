from web3 import Web3
from eth_account import Account
from web3.middleware import geth_poa_middleware
from eth_keys import keys
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

def getTransactions(wif):
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
    # data.sort(key=lambda x: int(x['timeStamp']))
    # print(data[0])
    res = []
    for transaction in data :
        tx = {
            "id" : transaction["hash"],
            "type" : "Received" if transaction["to"] == address else "Sent",
            "from" : transaction["from"] if transaction["to"] == address else transaction["to"],
            "amount" : int(transaction["value"])/ETHER_VALUE,
            "date" : datetime.fromtimestamp(int(transaction["timeStamp"])),
            "status" : "Completed",
        }
        res.append(tx)
    return res
    # current_balance = 0
    # balances = []
    # times = []

    # for tx in data:
    #     to = tx["to"]
    #     from_addr = tx["from"]
    #     value = int(tx["value"]) / ETHER_VALUE
    #     if "gasPrice" in tx:
    #         gas = int(tx["gasUsed"]) * int(tx["gasPrice"]) / ETHER_VALUE
    #         print("Gas_Price", gas)
    #     else:
    #         gas = int(tx["gasUsed"]) / ETHER_VALUE
    #         print("gas used :",gas) 
    #     time = datetime.fromtimestamp(int(tx['timeStamp']))
    #     money_in = to.lower() == address.lower()

    #     if money_in:
    #         current_balance += value
    #     else:
    #         current_balance -= value + gas

    #     balances.append(current_balance)
    #     times.append(time)


# --------------------------------------Tokens--------------------------------------


def getTokens():
    import json
    data = []

    with open("tokens.tsv", "r") as f:
        lines = f.readlines()
        for line in lines :
            t = line.split('\t')
            temp = {}
            temp["name"] = t[0]
            temp["address"] = t[1]
            temp["abi"] = t[2]
            data.append(temp)

    tokens = []

    for token_data in data :
        contract_address = Web3.toChecksumAddress(token_data["address"])
        contract_abi = json.loads(token_data["abi"])
        token = w3.eth.contract(address=contract_address, abi=contract_abi) 
        token_address = token.address
        tokens.append({"token" : token, "address" : token_address})
    
    return tokens

def getTokenBalance(wif, token):
    wall_address = getWallet(wif).address
    wall_address = Web3.toChecksumAddress(wall_address)
    token_balance = token.functions.balanceOf(wall_address).call()
    return token_balance

def buildTokenTransaction(payer_wif,payee_wif,token, amount):
    payer_wallet = getWallet(payer_wif)
    payee_wallet = getWallet(payee_wif)
    transaction = token.functions.transfer(payee_wallet.address, amount).buildTransaction()
    wall_addres = Web3.toChecksumAddress(wall_addres)
    transaction.update({ 'gas' : 70000 })
    transaction.update({ 'nonce' : w3.eth.get_transaction_count(payer_wallet.address)})
    signed_tx = w3.eth.account.sign_transaction(transaction, payer_wallet.private_key)
    return signed_tx

def transferToken(payer_wif,payee_wif,token, amount):
    signed_tx = buildTokenTransaction(payer_wif,payee_wif,token, amount)
    txn_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    txn_receipt = w3.eth.wait_for_transaction_receipt(txn_hash)
    print('Transaction receipt : ',txn_receipt)


#----------------------------------------------- dealing with nft --------------------------------------------


def getNFTs():
    import json
    data = []

    with open("nfts.tsv", "r") as f:
        lines = f.readlines()
        for line in lines :
            t = line.split('||')
            nft_data = {}
            nft_data["name"] = t[0]
            nft_data["address"] = t[1]
            nft_data["abi"] = t[2]
            data.append(nft_data)

    nfts = []

    for nft_data in data :
        nft_contract_address = Web3.toChecksumAddress(nft_data["address"]) 
        nft_contract_abi = json.loads(nft_data["abi"])
        nft_token = w3.eth.contract(address=nft_contract_address, abi=nft_contract_abi) 
        nft_token_address = nft_token.address
        nfts.append({"NFT" : nft_token, "address" : nft_token_address})
    
    return nfts

# address = Web3.toChecksumAddress('0x01Be0A95b30ec54Cc7333D4f3e310B494CE98576')

# nft_contract_address = Web3.toChecksumAddress('0xa72eD38A9A65ac85d53fFCF17407aBE627EA6c7C') 
# nft_abi = json.loads('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gettokenid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]')
# nft_contract_abi = nft_abi
# nft_token = w3.eth.contract(address=nft_contract_address, abi=nft_contract_abi) 

def getNFTBalance(wif, nft):
    address = getWallet(wif).address
    address = Web3.toChecksumAddress(address)
    nft_balance = nft.functions.balanceOf(address).call()
    return nft_balance

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
    nft_signed_tx = w3.eth.account.sign_transaction(nft_transaction, payer_wallet.private_key)
    return nft_signed_tx

def sendNFT(payer_wif, payee_wif, nft, nft_id):
    nft_signed_tx = buildNFTTransaction(payer_wif, payee_wif, nft, nft_id)
    nft_txn_hash = w3.eth.send_raw_transaction(nft_signed_tx.rawTransaction)
    return nft_txn_hash
	
def getNFTID(nft_token):
    nft_tokenid = nft_token.functions.gettokenid().call()
    return nft_tokenid