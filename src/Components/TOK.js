import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext'
import Transfer from './Transfer'
import FIL from "../assets/Icons/NFT placeholder/FIL.png"
import Cafe from "../assets/Icons/NFT placeholder/Cafe.png"
import IG from "../assets/Icons/NFT placeholder/IG.png"
import TH from "../assets/Icons/NFT placeholder/TechHub.png"

const Tokens = () => {

    const {ETH, TOK, prices, transferTOK, getTOK} = useUserContext()
    const [active, setActive] = useState({transform : "translateX(100%)", opacity : "0"})
    const [address, setAddress] = useState("")

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
        // console.log(to, parseFloat(amount), address)
        transferTOK(to, parseFloat(amount), address)
        .then(result => console.log(result))
    }

    const styles = {
        Container : {
            display : "flex",
            flexDirection : "column",
            width : "100%",
            height : "100%",
            padding : "2rem 0",
            gap : "3.2rem",
        },
        FlexContainer : {
            display : "flex",
            flexDirection : "column",
            alignItems : "center",
            gap : "0.8rem",
            fontSize : "1.2rem",
        },
        Balance : {
            fontSize : "4.6rem",
            fontFamily : "font-light",
        },
        Value : {
            fontSize : "1.4rem",
            marginTop : "-0.8rem"
        },
        Address : {
            fontSize : "1.6rem",
            padding : "0.5em 1.5em",
            borderRadius : "100vw",
            backgroundColor : "var(--clr-white-fill)",
            width : "45ch",
            display : "flex",
            justifyContent : "space-between",
            alignItems : "center",
            cursor : "pointer",
            marginTop : "0.5rem",
        },
        Send : {
            fontSize : "1em",
            padding : "1em",
            cursor : "pointer",
            backgroundColor : "var(--clr-green)",
        },
        CardWrapper : {
            display : "flex",
            width : "100%",
            gap : "5rem",
            overflow : "auto",
            justifyContent : "center",
        },
        Card : {
            display : "flex",
            flexDirection : "column",
            alignItems : "center",
        },
        NFTIMG : {
            width : "15vw",
            height : "15vw",
        },
        Refresh : {
            fontSize : "2rem",
            cursor : "pointer",
            marginLeft : "0.4px",
        }
    }

    const Images = {
        0 : FIL,
        1 : TH,
        2 : IG,
        3  : Cafe,
    }

    return(
        <>
            <div style = {styles.Container} >
                <div style={styles.FlexContainer} >
                    <p style = {styles.Balance} >
                        {
                            ETH?.balance
                            ? <div style = {{display : "flex"}} >{`${ETH.balance} ETH`} <ion-icon onClick = {getTOK} style = {styles.Refresh} name="refresh-circle-outline" /> </div>
                            : "Loading..."
                        }
                    </p>
                    <p style = {styles.Value} >
                        {
                            ETH?.balance && prices?.ETH 
                            ? `£${(prices?.ETH*ETH?.balance).toFixed(5)}`
                            : "Loading..."
                        }
                    </p>
                    <div style = {styles.Address} onClick={() => {navigator.clipboard.writeText(address)}} >
                        <p>
                            {
                                ETH?.address 
                                ? ETH?.address.slice(0, 10) + "...." + ETH?.address.slice(ETH?.address.length-4, ETH?.address.length)
                                : "Loading..."
                            }
                        </p>
                        <ion-icon name="copy-outline" style = {styles.Copy} />
                    </div>
                </div>
                <div style = {styles.CardWrapper} >
                    {
                        TOK?.map((item, index) => (
                            <div key = {index} data-attribute = "asset-card" style = {styles.Card} >
                                <a target = "_blank" rel="noreferrer" href = {`https://rinkeby.etherscan.io/token/${item.address}`} ><img src = {Images[index]} alt = "FIL Token" style = {styles.NFTIMG} /></a>
                                <div style ={{textAlign : "center", cursor : "pointer"}} onClick = {e => {handeModalChange("open"); setAddress(item.address)}} >
                                    <p style = {{marginTop : "2rem", fontSize : "1.6rem"}}>{item.name}</p>
                                    <h2 style = {{fontSize : "2.6rem"}}>{item.symbol}</h2>
                                    <p style = {{fontSize : "2rem", marginBottom : "2rem"}}>Balance : {item.balance}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <Transfer name = "Ethereum" transfer = {handleTransfer} handeModalChange = {handeModalChange} active = {active} currency = "ETH" balance = {ETH?.balance} value = {ETH?.balance * 18000} address = "0xh1jn3iu12iu31h2niu3123hm12u3ng2123g" history = {ETH?.history} />
        </>
    )
}

export default Tokens