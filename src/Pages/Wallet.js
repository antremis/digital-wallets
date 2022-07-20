import React, {useState} from'react'
import Card from '../Components/Card'
import Table from '../Components/Table/Table'
import { useUserContext } from '../Context/UserContext'
import Bitcoin from "../assets/Icons/Currencies/Bitcoin.svg";
import Ethereum from "../assets/Icons/Currencies/Ethereum.svg";
import Ripple from "../assets/Icons/Currencies/Ripple.svg";
import NonFungibleToken from "../assets/Icons/Currencies/NFT.svg";
import Tokens from "../assets/Icons/Currencies/Tokens.svg";
import Cash from "../assets/Icons/Currencies/cash-outline.svg";
import Down from "../assets/Icons/Status/performance-decrease.svg";

const Wallet = () => {

    const {FIAT, BTC, ETH, XRP, prices} = useUserContext()

    const [data] = useState([
        {
            key : 1,
            uri : Bitcoin,
            name : "Bitcoin",
            currency : "BTC",
            balance : BTC?.balance,
            value : (prices?.BTC*BTC?.balance).toFixed(5),
            address : BTC?.address,
            url : "/accounts/BTC"
        },
        {
            key : 2,
            uri : Ethereum,
            name : "Ethereum",
            currency : "ETH",
            balance : ETH?.balance,
            value : (prices?.ETH*ETH?.balance).toFixed(5),
            address : ETH?.address,
            url : "/accounts/ETH"
        },
        {
            key : 3,
            uri : Ripple,
            name : "Ripple",
            currency : "XRP",
            balance : XRP?.balance,
            value : (prices?.XRP*XRP?.balance).toFixed(5),
            address : XRP?.address,
            url : "/accounts/XRP"
        },
        {
            key : 4,
            uri : NonFungibleToken,
            name : "NFT",
            currency : "ETH",
            balance : ETH?.balance,
            value : "$5000",
            address : ETH?.address,
            url : "/accounts/TOK"
        },
        {
            key : 5,
            uri : Tokens,
            name : "Token",
            currency : "ETH",
            balance : ETH?.balance,
            value : "$5000",
            address : ETH?.address,
            url : "/accounts/NFT"
        },
        // {
        //     key : 6,
        //     uri : Cash,
        //     name : "FIAT Assets",
        //     currency : "INR",
        //     balance : FIAT?.balance,
        //     value : FIAT?.balance,
        //     address : "HBCDJS83927",
        //     url : "/accounts/FIAT"
        // }
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
            padding : "4rem 2rem",
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-between",
            border : "1px solid var(--clr-white-border)",
        },
        IMG2 : {
            gridColumn : "3 / span 1",
            gridRow : "1 / span 1",
            backgroundColor : "black"
        },
        Wrapper : {
            gridColumn : "2 / span 2",
            gridRow : "2 / span 2",
            padding : "0 0 1rem 0",
            display : "flex",
            alignItems : "flex-end",
            placeItems : "grid-start",
        }
    }

    return(
        <div style = {styles.FlexContainer} >
            <div style = {styles.CardWrapper} >
                {data.map(item => (
                    <Card key = {item.key} uri = {item.uri} name = {item.name} currency = {item.currency} balance = {item.balance} value = {item.value} address = {item.address} url = {item.url} />
                ))}
            </div>
            <div style = {styles.WalletValue} >
                <div style = {{display : "flex", justifyContent : "space-between"}}>
                    <p style = {{fontSize : "1.6rem", fontWeight : "600"}} >Total assets in cash</p>
                    <p style = {{fontSize : "1.6rem", filter: "invert(17%) sepia(96%) saturate(7360%) hue-rotate(6deg) brightness(99%) contrast(118%)",}} ><img src = {Down} style = {{height : "1.6ch", marginRight : "2px"}} />24%</p>
                </div>
                <div>
                    <p style = {{fontSize : "calc(33vw / 10)"}} >£ {(prices?.BTC*BTC?.balance + prices?.ETH*ETH?.balance + prices?.XRP*XRP?.balance).toFixed(5)}</p>
                    <p style = {{fontSize : "1.4rem", marginTop : "-0.8rem"}} >Pound</p>
                </div>
            </div>
            <div style = {styles.Wrapper} >
                <Table
                    headers={[
                        "ID",
                        "Transfer Type",
                        "From",
                        "Amount",
                        "Date",
                        "Status",
                    ]}
                    minCellWidth = {120}
                    history = {[...BTC?.history, ...ETH?.history ,...XRP?.history]}
                    width = "62vw"
                    maxHeight = "40vh"
                />
            </div>
        </div>
    )
}

export default Wallet