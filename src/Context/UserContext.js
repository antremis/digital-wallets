import React, {useEffect, useState, useContext, createContext} from 'react'
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
        setBTC({balance : 0, history : [], address : ""})
        setStatus("Getting BTC Balance")
        // setLoading(true)
        const balance = await Axios.get(`${BaseUri}/api/btc/balance`)
        setStatus("Getting BTC History")
        const history = await Axios.get(`${BaseUri}/api/btc/history`)
        console.log(balance, history)
        setBTC({
            balance : balance.data.balance.balance,
            address : balance.data.balance.address,
            history : history.data.tx_history,
        })
        // setLoading(false)
        setStatus("")
    }
    
    const getETH = async () => {
        setETH({balance : 0, history : [], address : ""})
        setStatus("Getting ETH Balance")
        // setLoading(true)
        const balance = await Axios.get(`${BaseUri}/api/eth/balance`)
        setStatus("Getting ETH History")
        const history = await Axios.get(`${BaseUri}/api/eth/history`)
        setETH({
            balance : balance.data.balance.balance,
            address : balance.data.balance.address,
            history : history.data.tx_history,
        })
        // setLoading(false)
        setStatus("")
    }
    
    const getXRP = async () => {
        setXRP({balance : 0, history : [], address : ""})
        setStatus("Getting XRP Balance")
        // setLoading(true)
        const balance = await Axios.get(`${BaseUri}/api/xrp/balance`)
        setStatus("Getting XRP History")
        const history = await Axios.get(`${BaseUri}/api/xrp/history`)
        setXRP({
            balance : balance.data.balance.balance,
            address : balance.data.balance.address,
            history : history.data.tx_history,
        })
        // setLoading(false)
        setStatus("")
    }
    
    const getWallet = async () => {
        // setLoading(true)
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
        // setLoading(false)
    }

    const transfer = async (chain, to, value) => {
        // setLoading(true)
        setStatus(`Transferring ${chain.toUpperCase()}`)
        window.alert(`Transferring ${chain.toUpperCase()}`)
        const result = await Axios.post(`${BaseUri}/api/${chain}/transfer`, {to, value})
        // setLoading(false)
        setStatus("")
        return result
    }

    const transferTOK = async (to, value, address) => {
        // setLoading(true)
        setStatus(`Transferring Token`)
        window.alert(`Transferring Token`)
        const result = await Axios.post(`${BaseUri}/api/tok/transfer`, {to, value, address})
        // setLoading(false)
        setStatus("")
        return result
    }

    const transferNFT = async (to, address, id) => {
        // setLoading(true)
        setStatus(`Transferring NFT`)
        window.alert(`Transferring NFT`)
        const result = await Axios.post(`${BaseUri}/api/nft/transfer`, {to, address, id})
        // setLoading(false)
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
        let api = ""
        const API_KEY = "C20F0724-64A3-47E4-913C-0B6E92426C48"
        let ticker
        if (user){
            let temp = {}
            Axios.get("https://rest.coinapi.io/v1/exchangerate/BTC/GBP", {headers : {'X-CoinAPI-Key': API_KEY}})
            .then(data => temp["BTC"] = data.data.rate)
            .catch(err => console.log(err))
            Axios.get("https://rest.coinapi.io/v1/exchangerate/ETH/GBP", {headers : {'X-CoinAPI-Key': API_KEY}})
            .then(data => temp["ETH"] = data.data.rate)
            .catch(err => console.log(err))
            Axios.get("https://rest.coinapi.io/v1/exchangerate/XRP/GBP", {headers : {'X-CoinAPI-Key': API_KEY}})
            .then(data => temp["XRP"] = data.data.rate)
            .catch(err => console.log(err))
            setPrices(temp)
            // ticker = setInterval(() => {
            //     Axios.get("https://rest.coinapi.io/v1/exchangerate/BTC/GBP", {headers : {'X-CoinAPI-Key': YATINAPI2}})
            //     .then(data => temp["BTC"] = data.data.rate)
            //     .catch(err => console.log(err))
            //     Axios.get("https://rest.coinapi.io/v1/exchangerate/ETH/GBP", {headers : {'X-CoinAPI-Key': YATINAPI2}})
            //     .then(data => temp["ETH"] = data.data.rate)
            //     .catch(err => console.log(err))
            //     Axios.get("https://rest.coinapi.io/v1/exchangerate/XRP/GBP", {headers : {'X-CoinAPI-Key': YATINAPI2}})
            //     .then(data => temp["XRP"] = data.data.rate)
            //     .catch(err => console.log(err))
            //     setPrices(temp)
            // }, 60000)
        }
        else {
            clearInterval(ticker)
        }
        return () => {
            clearInterval(ticker)
        }
    }, [user])

    return (
        <UserContext.Provider value = {{status, FIAT, BTC, ETH, XRP, NFT, TOK, prices, getFIAT , getBTC, getETH, getXRP, transfer, transferTOK, transferNFT}}>
            {loading ? <Loading text = {status} /> : children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
export const useUserContext = () => useContext(UserContext)