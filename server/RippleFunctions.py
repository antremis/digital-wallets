# Yatin Bajaj
# Testing the ripple apis and its  functionalities

# Referred to this https://xrpl.org/get-started-using-python.html

import xrpl

def getTestClient():
    # Established connection to the XRP ledger
    # Connected to a testnet
    from xrpl.clients import JsonRpcClient
    JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    client = JsonRpcClient(JSON_RPC_URL)

    # To connect to the production XRP ledger

    # Way 1:
    # from xrpl.clients import JsonRpcClient
    #
    # JSON_RPC_URL = "http://localhost:5005/"
    # client = JsonRpcClient(JSON_RPC_URL)

    # Way 2:
    # from xrpl.clients import JsonRpcClient
    #
    # JSON_RPC_URL = "https://s2.ripple.com:51234/"
    # client = JsonRpcClient(JSON_RPC_URL)
    # print(client.address)
    return client

def createWallet(client):
    from xrpl.wallet import generate_faucet_wallet
    test_wallet = generate_faucet_wallet(client, debug=True)

    seed = test_wallet.seed
    sequence = test_wallet.sequence
    return f"{seed}+{sequence}"

def getWallet(wif):
    wif = wif.split("+")
    return xrpl.wallet.Wallet(wif[0], wif[1])

def sendTransaction(wif_payer, wif_payee, value, client):
    from xrpl.models.transactions import Payment
    from xrpl.utils import xrp_to_drops
    wallet_payer = getWallet(wif_payer)
    wallet_payee = getWallet(wif_payee)
    my_tx_payment = Payment(
        account = wallet_payer.classic_address,
        amount = xrp_to_drops(value),
        destination = wallet_payee.classic_address,
    )

    # Sign the Payment
    from xrpl.transaction import safe_sign_and_autofill_transaction
    my_tx_payment_signed = safe_sign_and_autofill_transaction(my_tx_payment, wallet_payer, client)

    # Submit and send the transaction
    from xrpl.transaction import send_reliable_submission
    tx_response = send_reliable_submission(my_tx_payment_signed, client)

    return tx_response


def getBalance(wif, client):
    from xrpl.account import get_balance
    address = getWallet(wif).classic_address
    return {"address" : address, "balance" : int(get_balance(address, client)/10**6)}
    # return int(get_balance(address, client)/10**6)

def getTransactionDetails(json, account_add):
    from datetime import datetime
    txnData = []
    for transaction in json["transactions"]:
        # print(txnID, amt, sender, receiver, date)
        tx = {
            "id" : transaction["tx"]["hash"],
            "type" : "Received" if transaction["tx"]["Destination"] == account_add else "Sent",
            "from" : transaction["tx"]["Account"],
            "amount" : int(transaction["tx"]["Amount"])/10**6,
            "date" : datetime.fromtimestamp(int(transaction["tx"]["date"])+946684800),
            "status" : "Completed"
        }
        txnData.append(tx)
    return txnData

# def getTransactions(wif, client):
#     wallet = getWallet(wif)
#     address = wallet.classic_address
#     response = client.request(xrpl.models.requests.AccountLines(
#         account = address,
#         ledger_index = "validated",
#     ))
#     # return response.result
#     return getTransactionDetails(response.result, address)

def getTransactions(wif, n, client):
    # Look up info about your account transactions
    from xrpl.models.requests.account_tx import AccountTx
    acc = getWallet(wif).classic_address
    acct_tx = AccountTx(
        account=acc,
        binary = False,
        forward = False,
        ledger_index_max = -1,
        ledger_index_min = -1,
        limit=n
    )
    response = client.request(acct_tx)
    return getTransactionDetails(response.result, acc)

# result = response.result
# print("response.status: ", response.status)
# import json
# print(json.dumps(response.result, indent=4, sort_keys=True))

# def check_non_xrp_balance(wallet):
#     print("Getting hot address balances...")
#     response = client.request(xrpl.models.requests.AccountLines(
#         account=wallet.classic_address,
#         ledger_index="validated",
#     ))
#     print("\n\n", response)
