import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext';
import ChainInfo from './ChainInfo';
import Transfer from './Transfer';

const FIAT = () => {

    const {FIAT, getFIAT} = useUserContext()
    const [active, setActive] = useState({transform : "translateX(100%)", opacity : "0"})

    const handeModalChange = (type) => {
        if(type === "open") {
            setActive({transform : "translateX(0)", opacity : "1"})
        }
        else {
            setActive({transform : "translateX(100%)", opacity : "0"})
        }
    }

    const handleTransfer = (e, to, amount) => {
        
    }

    return(
        <>
            <ChainInfo refresh = {getFIAT} currency = "INR" balance = {FIAT?.balance} value = {FIAT?.balance?.toFixed(5)} address = {FIAT?.address} history = {FIAT?.history} txuri = "https://www.blockchain.com/FIAT-testnet/tx/" adduri = "https://www.blockchain.com/FIAT-testnet/address/"  headers = {["Txn ID", "Stock ID", "Quantity", "Price", "Amount", "Date"]}/>
            <Transfer transfer = {handleTransfer} handeModalChange = {handeModalChange} active = {active} currency = "FIAT" balance = {FIAT?.balance} value = {FIAT?.balance * 18000} address = {FIAT?.address} history = {FIAT?.history} />
        </>
    )
}

export default FIAT