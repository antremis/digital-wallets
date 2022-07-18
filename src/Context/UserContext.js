import React, {useEffect, useState, useContext, createContext} from 'react'
// import axios from 'axios'
import Axios from "../Axios/Axios"
import { useAuthContext } from './AuthContext'
import Loading from '../Components/Loading'
import BaseUri from "./BaseUri"

const UserContext = createContext()

const UserContextProvider = ({children}) => {

    const [BTC, setBTC] = useState({balance : 0, history : [], address : ""})
    const [ETH, setETH] = useState({balance : 0, history : [], address : ""})
    const [XRP, setXRP] = useState({balance : 0, history : [], address : ""})
    const [NFT, setNFT] = useState([])
    const [TOK, setTOK] = useState([])
    // const [FIAT, setFIAT] = useState({balance : 0, history : []})
    const [prices, setPrices] = useState({})
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState("")
    const {user} = useAuthContext()
    const FIAT = {
        balance : 0,
        address : "whosejoe",
        history : [],
    }

    const getFIAT = () => {
        
    }

    const getBTC = async () => {
        setStatus("Getting BTC Balance")
        setLoading(true)
        const balance = await Axios.get(`${BaseUri}/api/btc/balance`)
        setStatus("Getting BTC History")
        const history = await Axios.get(`${BaseUri}/api/btc/history`)
        console.log(balance, history)
        setBTC({
            balance : balance.data.balance.balance,
            address : balance.data.balance.address,
            history : history.data.tx_history,
        })
        setLoading(false)
        setStatus("")
    }
    
    const getETH = async () => {
        setStatus("Getting ETH Balance")
        setLoading(true)
        const balance = await Axios.get(`${BaseUri}/api/eth/balance`)
        setStatus("Getting ETH History")
        const history = await Axios.get(`${BaseUri}/api/eth/history`)
        setETH({
            balance : balance.data.balance.balance,
            address : balance.data.balance.address,
            history : history.data.tx_history,
        })
        setLoading(false)
        setStatus("")
    }
    
    const getXRP = async () => {
        setStatus("Getting XRP Balance")
        setLoading(true)
        const balance = await Axios.get(`${BaseUri}/api/xrp/balance`)
        setStatus("Getting XRP History")
        const history = await Axios.get(`${BaseUri}/api/xrp/history`)
        setXRP({
            balance : balance.data.balance.balance,
            address : balance.data.balance.address,
            history : history.data.tx_history,
        })
        setLoading(false)
        setStatus("")
    }
    
    const getWallet = async () => {
        setLoading(true)
        setStatus("Getting User NFTs")
        const nfts = await Axios.get(`${BaseUri}/api/nft/get`)
        setStatus("Getting User Tokens")
        const toks = await Axios.get(`${BaseUri}/api/tok/get`)
        setNFT(nfts.data.NFTs)
        setTOK(toks.data.Tokens)
        setStatus("Getting User Balances")
        const balance = await Axios.get(`${BaseUri}/api/wallet/balance`)
        setStatus("Getting User Transaction Histories")
        const history = await Axios.get(`${BaseUri}/api/wallet/history`)
        setBTC({
            balance : balance.data.result.BTC.balance,
            address : balance.data.result.BTC.address,
            history : history.data.result.BTC,
        })
        setETH({
            balance : balance.data.result.ETH.balance,
            address : balance.data.result.ETH.address,
            history : history.data.result.ETH,
        })
        setXRP({
            balance : balance.data.result.XRP.balance,
            address : balance.data.result.XRP.address,
            history : history.data.result.XRP,
        })
        // setFIAT({
        //     balance : 1000,
        //     address : "ASDHM10231211",
        //     history : history.data.result.FIAT,
        // })
        setLoading(false)
    }

    const transfer = async (chain, to, value) => {
        setLoading(true)
        setStatus(`Transferring ${chain.toUpperCase()}`)
        const result = await Axios.post(`${BaseUri}/api/${chain}/transfer`, {uid_payee : to, value})
        setLoading(false)
        setStatus("")
        return result
    }

    useEffect(() => {
        if(user !== null) {
            getWallet()
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        let ticker
        if (user){
            let temp = {}
            ticker = setInterval(() => {
                fetch("https://api.coindcx.com/exchange/ticker")
                .then(result => result.json())
                .then(result => {
                    result?.forEach((coin) => {
                        if(coin.market === "BTCINR"){
                            temp["BTC"] = coin.last_price
                        }
                        else if(coin.market === "ETHINR"){
                            temp["ETH"] = coin.last_price
                        }
                        else if(coin.market === "XRPINR"){
                            temp["XRP"] = coin.last_price
                        }
                    })
                    setPrices(temp)
                })
            }, 5000)
        }
        else {
            clearInterval(ticker)
        }
        return () => {
            clearInterval(ticker)
        }
    }, [user])

    return (
        <UserContext.Provider value = {{status, FIAT, BTC, ETH, XRP, NFT, TOK, prices, getFIAT , getBTC, getETH, getXRP, transfer}}>
            {loading ? <Loading text = {status} /> : children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
export const useUserContext = () => useContext(UserContext)