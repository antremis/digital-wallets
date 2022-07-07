import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext'
import ChainInfo from './ChainInfo'
import Transfer from './Transfer'

const TOK = () => {

    const {ETH} = useUserContext()
    const [active, setActive] = useState({transform : "translateX(100%)", opacity : "0"})

    const handeModalChange = (type) => {
        if(type === "open") {
            setActive({transform : "translateX(0)", opacity : "1"})
        }
        else {
            setActive({transform : "translateX(100%)", opacity : "0"})
        }
    }

    const history = [{
        id : "0x123123102931203m12j3h123nhm123h1231i12381231h22o313",
        type : "Recieved",
        from : "0x123123102931203m12j3h123nhm123",
        amount : "0.123 BTC",
        date : "12/12/2020",
        status : "Completed",
    }]

    return(
        <>
            <ChainInfo handeModalChange = {handeModalChange} currency = "ETH" balance = {ETH?.balance} value = {ETH?.balance * 18000} address = "0xh1jn3iu12iu31h2niu3123hm12u3ng2123g" history = {history} />
            <Transfer handeModalChange = {handeModalChange} active = {active} currency = "ETH" balance = {ETH?.balance} value = {ETH?.balance * 18000} address = "0xh1jn3iu12iu31h2niu3123hm12u3ng2123g" history = {ETH?.history} />
        </>
    )
}

export default TOK