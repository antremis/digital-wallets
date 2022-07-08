import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext';
import ChainInfo from './ChainInfo';
import Transfer from './Transfer';

const BTC = () => {

    const {BTC, transfer, prices, getFIAT} = useUserContext()
    const [active, setActive] = useState({transform : "translateX(100%)", opacity : "0"})

    const FIAT = {
        balance : "0",
        address : "whosejoe",
        hisotory : [],
    }


    const handeModalChange = (type) => {
        if(type === "open") {
            setActive({transform : "translateX(0)", opacity : "1"})
        }
        else {
            setActive({transform : "translateX(100%)", opacity : "0"})
        }
    }

    const handleTransfer = (e, to, amount) => {
        e.preventDefault()
        transfer("btc", to, parseFloat(amount))
        .then(result => console.log(result))
    }

    return(
        <>
            <ChainInfo refresh = {getBTC} currency = "BTC" balance = {BTC?.balance} value = {(prices?.BTC*BTC?.balance).toFixed(5)} address = {BTC?.address} history = {BTC?.history} txuri = "https://www.blockchain.com/btc-testnet/tx/" adduri = "https://www.blockchain.com/btc-testnet/address/" />
            <Transfer transfer = {handleTransfer} handeModalChange = {handeModalChange} active = {active} currency = "BTC" balance = {BTC?.balance} value = {BTC?.balance * 18000} address = {BTC?.address} history = {BTC?.history} />
        </>
    )
}

export default BTC