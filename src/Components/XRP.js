import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext'
import ChainInfo from './ChainInfo'
import Transfer from './Transfer'

const XRP = () => {
    const {XRP, prices, transfer, getXRP} = useUserContext()
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
        e.preventDefault()
        transfer("xrp", to, parseFloat(amount))
        .then(result => console.log(result))
    }

    return(
        <>
            <ChainInfo refresh = {getXRP} handeModalChange = {handeModalChange} currency = "XRP" balance = {XRP?.balance} value = {(prices?.XRP*XRP?.balance).toFixed(5)} address = {XRP?.address} history = {XRP?.history} txuri = "https://testnet.xrpl.org/transactions/" adduri = "https://testnet.xrpl.org/accounts/" />
            <Transfer transfer = {handleTransfer} handeModalChange = {handeModalChange} active = {active} currency = "XRP" balance = {XRP?.balance} value = {(prices?.XRP*XRP?.balance).toFixed(5)} address = {XRP?.address} history = {XRP?.history} />
        </>
    )
}

export default XRP