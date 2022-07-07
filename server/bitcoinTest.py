def createWallet(uid) :
    from bitcoinlib.wallets import Wallet
    wallet = Wallet.create(name = uid, network = "testnet")
    return wallet

def getWallet(uid) :
    from bitcoinlib.wallets import Wallet
    key = Wallet(uid)
    return key

def getPrivateKey(key) :
    private_key = key.to_hex()
    return private_key

def getAddress(key) :
    address = key.address
    return address

def getPublicKey(key) :
    public_key = key.public_key.hex()
    return public_key

def getTransactions(key) :
    transactions = key.get_transactions()
    return transactions

def getBalance(key) :
    balance = key.get_balance("btc")
    return balance

def sendTransaction(key, address, amount) :
    transaction = key.send([(address, amount, "btc")])
    return transaction

def getTransactionDetails(tx) :
    import bitcoin
    transaction = bitcoin.fetchtx(tx)
    return transaction

if __name__ == "__main__" :

    # 604ddf25-8d29-4bc0-a7a6-5dfcd1164b92
    # wallet = getWallet("seed fluid float habit invest snap grant dove parent mechanic patch crop")
    # key = wallet.get_key()
    # print(key.address)
    # print("Use For Imports Only")
    