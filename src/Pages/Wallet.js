import React, {useState} from'react'
import Card from '../Components/Card'
import Table from '../Components/Table/Table'
import { useUserContext } from '../Context/UserContext'

const Wallet = () => {

    const {BTC, ETH, XRP, prices} = useUserContext()
    console.log(prices)

    const [data] = useState([
        {
            key : 1,
            uri : "https://cdn.jsdelivr.net/npm/cryptocoins-icons@2.9.0/SVG/BTC.svg",
            name : "Bitcoin",
            currency : "BTC",
            balance : BTC?.balance,
            value : (prices?.BTC*BTC?.balance).toFixed(5),
            address : BTC?.address,
        },
        {
            key : 2,
            uri : "https://cdn.jsdelivr.net/npm/cryptocoins-icons@2.9.0/SVG/ETH.svg",
            name : "Ethereum",
            currency : "ETH",
            balance : ETH?.balance,
            value : (prices?.ETH*ETH?.balance).toFixed(5),
            address : ETH?.address,
        },
        {
            key : 3,
            uri : "https://cdn.jsdelivr.net/npm/cryptocoins-icons@2.9.0/SVG/XRP.svg",
            name : "Ripple",
            currency : "XRP",
            balance : XRP?.balance,
            value : (prices?.XRP*XRP?.balance).toFixed(5),
            address : XRP?.address,
        },
        {
            key : 4,
            uri : "https://img.icons8.com/external-wanicon-solid-wanicon/344/external-nft-nft-wanicon-solid-wanicon.png",
            name : "NFT",
            currency : "ETH",
            balance : ETH?.balance,
            value : "$5000",
            address : ETH?.address,
        },
        {
            key : 5,
            uri : "https://img.icons8.com/external-glyph-wichaiwi/344/external-token-gamefi-glyph-wichaiwi.png",
            name : "Token",
            currency : "ETH",
            balance : ETH?.balance,
            value : "$5000",
            address : ETH?.address,
        },
    ])

    const styles = {
        FlexContainer : {
            width : "100%",
            height : "100%",
            display : "grid",
            gap : "2rem 4rem",
            gridTemplateColumns : "30% 1fr 1fr",
            gridTemplateRows : "repeat(3, 1fr)",
        },
        CardWrapper : {
            gridColumn : "1 / span 1",
            gridRow : "1 / span 3",
            display : "grid",
            gridAutoRows : "35%",
            gap : "2rem",
            height : "100%",
            maxHeight : "85vh",
            overflowY : "auto",
            padding : "1rem",
        },
        WalletValue : {
            gridColumn : "2 / span 1",
            gridRow : "1 / span 1",
            padding : "2rem",
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-between",
            border : "1px solid var(--clr-white-dark)",
        },
        IMG2 : {
            gridColumn : "3 / span 1",
            gridRow : "1 / span 1",
            backgroundColor : "black"
        },
        Wrapper : {
            gridColumn : "2 / span 2",
            gridRow : "2 / span 2",
            display : "flex",
            alignItems : "flex-end",
        }
    }

    return(
        <div style = {styles.FlexContainer} >
            <div style = {styles.CardWrapper} >
                {data.map(item => (
                    <Card key = {item.key} uri = {item.uri} name = {item.name} currency = {item.currency} balance = {item.balance} value = {item.value} address = {item.address} />
                ))}
            </div>
            <div style = {styles.WalletValue} >
                <div style = {{display : "flex", justifyContent : "space-between"}}>
                    <p style = {{fontSize : "1.5rem", fontWeight : "600"}} >Total assets in cash</p>
                    <p style = {{fontSize : "1.5rem"}} >profit</p>
                </div>
                <div>
                    <p style = {{fontSize : "4.6rem"}} >{`₹ ${(prices?.BTC*BTC?.balance + prices?.ETH*ETH?.balance + prices?.XRP*XRP?.balance).toFixed(5)}`}</p>
                    <p style = {{fontSize : "1.4rem", marginTop : "-1rem"}} >INR</p>
                </div>
            </div>
            <div style = {styles.IMG2} ></div>
            <div style = {styles.Wrapper} >
                <Table
                    headers={[
                        "Transaction ID",
                        "Transfer Type",
                        "From",
                        "Amount",
                        "Date",
                        "Status",
                    ]}
                    minCellWidth = {120}
                    history = {[...BTC?.history, ...XRP?.history]}
                    maxWidth = "62vw"
                    maxHeight = "40vh"
                />
            </div>
        </div>
    )
}

export default Wallet