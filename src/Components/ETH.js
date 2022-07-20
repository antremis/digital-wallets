import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext'
import ChainInfo from './ChainInfo'
import Transfer from './Transfer'

const ETH = () => {

    const {ETH, prices, transfer, getETH} = useUserContext()
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
        transfer("eth", to, parseFloat(amount))
        .then(result => console.log(result))
    }

    return(
        <>
            <ChainInfo refresh = {getETH} handeModalChange = {handeModalChange} currency = "ETH" balance = {ETH?.balance} value = {(prices?.ETH*ETH?.balance).toFixed(5)} address = {ETH?.address} history = {ETH?.history} />
            <Transfer name = "Ethereum" transfer = {handleTransfer} handeModalChange = {handeModalChange} active = {active} currency = "ETH" balance = {ETH?.balance} value = {(prices?.ETH*ETH?.balance).toFixed(5)} address = {ETH?.address} history = {ETH?.history} />
        </>
    )
}

export default ETH