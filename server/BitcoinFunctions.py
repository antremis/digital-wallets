def createWallet() :
    from bit import PrivateKeyTestnet
    key = PrivateKeyTestnet()
    return key.to_wif()

def getKey(wif) :
    from bit import PrivateKeyTestnet
    key = PrivateKeyTestnet(wif)
    return key

def getAddress(key) :
    address = key.address
    return address

def hideText(text):
    return f"{text[:6]}...{text[-4:]}"

def getTransactions(wif, admin) :
    from datetime import datetime
    import random
    key = getKey(wif)
    transactions = key.get_transactions()
    tx_data = []
    for tx in transactions:
        if not admin :
            tx = hideText(tx)
        tx_data.append({
            "id" : tx,
            "type" : "Recieved",
            "from" : hideText("192M9182M3M9Q8YU3M12U3YM19283Y19283YMM93Y5854Y"),
            "amount" : 0.0001,
            "date" : datetime.fromtimestamp(random.randint(1655252379, 1657252379)),
            "status" : "Completed",
            "txuri" : f"https://www.blockchain.com/btc-testnet/tx/{tx}",
            "adduri" : "https://www.blockchain.com/btc-testnet/address/192M9182M3M9Q8YU3M12U3YM19283Y19283YMM93Y5854Y",
            "chain" : "Bitcoin-Testnet",
        })
    return tx_data

def getBalance(wif) :
    key = getKey(wif)
    balance = key.get_balance("btc")
    return {"address" : getAddress(key), "balance" : balance}
    # return str(balance)

def sendTransaction(wif_payer, wif_payee, value) :
    key_payer = getKey(wif_payer)
    key_payee = getKey(wif_payee)
    transaction = key_payer.send([(key_payee.address, value, "btc")])
    return transaction

def getTransactionDetails(tx) :
    import bitcoin
    transaction = bitcoin.fetchtx(tx)
    return transaction

if __name__ == "__main__" :
    # WIF1 = "cSuz9YFQXzjH5HtPyWYJNi95C7CDhbhLshjhYodUHLTMDmUrCyuy"
    # WIF2 = "cRxWJMc8CATAEQVvGWqmwdKL27S938jpcZ1ENqNxRvwkc3pNmcra"
    # FAUCET_ADDRESS = "mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB"
    # key1 = getKey(WIF1)
    # key2 = getKey(WIF2)
    # print("\n")
    # print("Key1 Private Key: " + getPrivateKey(key1))
    # print("Key1 Public Key: " + getPublicKey(key1))
    # print("key1 address: " + getAddress(key1))
    # print("\n")
    # print("Key2 Private Key: " + getPrivateKey(key2))
    # print("Key2 Public Key: " + getPublicKey(key2))
    # print("key2 address: " + getAddress(key2))
    # print("\n")
    # T1 = "7ad2e84db8e619f0ac4748bbce669c6f4f9740691bb1d4e98769f13e241b6f0e"
    # T2 = "50c16b5f7090f553b304a195a52b35e9e976a82b8b804fe256c53d6e58408518"
    # T3 = "53329d953d57af2df171b5a4369713231074fc5bf2a5907d3236b8d4d35ce664"
    # T4 = sendTransaction(key1, getAddress(key2), 0.001)
    # print(T4)
    # print(type(T4))
    # import pickle
    # with open("var.pkl", "rb") as f:
    #     T4 = pickle.load(f)
    # print(T4.info())
    # key = getKey("cVYEqZz4vsQxNN1zhyFWLaLy9fiABcPnd6ntpmjYKKSjMPjpaHj7")
    # print(key.address)
    print("Use For Imports Only")