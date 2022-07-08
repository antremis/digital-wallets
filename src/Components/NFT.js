import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext'
import BAP from "../assets/Icons/NFT placeholder/Bored Ape.png"
import CP from "../assets/Icons/NFT placeholder/Crypto Punk.png"
import NFTY from "../assets/Icons/NFT placeholder/NFT Yourself.png"
import FILN from "../assets/Icons/NFT placeholder/FILN.jpeg"
import Transfer from './Transfer'

const NFT = () => {

    const {ETH, prices} = useUserContext()
    const [active, setActive] = useState({transform : "translateX(100%)", opacity : "0"})

    const handeModalChange = (type) => {
        if(type === "open") {
            setActive({transform : "translateX(0)", opacity : "1"})
        }
        else {
            setActive({transform : "translateX(100%)", opacity : "0"})
        }
    }

    const styles = {
        Container : {
            display : "flex",
            flexDirection : "column",
            width : "100%",
            height : "100%",
            padding : "1rem 0",
            gap : "7rem",
        },
        FlexContainer : {
            display : "flex",
            flexDirection : "column",
            alignItems : "center",
            gap : "0.8rem",
            fontSize : "1.2rem",
        },
        Balance : {
            fontSize : "3em",
            fontWeight : "400",
        },
        Value : {
            fontSize : "0.8em",
            marginTop : "-1.2em"
        },
        Address : {
            fontSize : "0.8em",
            padding : "0.5em 1.5em",
            borderRadius : "100vw",
            backgroundColor : "var(--clr-white-dark)",
            width : "35ch",
            display : "flex",
            justifyContent : "space-between",
            alignItems : "center",
            cursor : "pointer",
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
            gap : "1.5rem",
            border : "1px solid var(--clr-white-darker)",
            alignItems : "center",
            padding : "1rem",
            cursor : "pointer",
        },
        NFTIMG : {
            width : "20rem",
            height : "20rem",
        },
    }

    const history = [{
        id : "0x123123102931203m12j3h123nhm123h1231i12381231h22o313",
        type : "Recieved",
        from : "0x123123102931203m12j3h123nhm123",
        amount : "0.123 ETH",
        date : "12/12/2020 16:22:51 GMT",
        status : "Completed",
    }]

    return(
        <>
            <div style = {styles.Container} >
                <div style={styles.FlexContainer} >
                    <h1 style = {styles.Balance} >{ETH?.balance} {"ETH"}</h1>
                    <p style = {styles.Value} >₹{(prices?.ETH*ETH?.balance).toFixed(5)}</p>
                    <div style = {styles.Address} onClick={() => {navigator.clipboard.writeText(ETH?.address)}} >
                        <p>{`${ETH?.address?.slice(0, 10)}....${ETH?.address?.slice(ETH?.address?.length-4, ETH?.address?.length)}`}</p>
                        <ion-icon name="copy-outline" style = {styles.Copy} />
                    </div>
                    {/* <div style = {styles.Send} onClick = {() => handeModalChange("open")} >Send</div> */}
                </div>
                <div style = {styles.CardWrapper} >
                    <a style = {styles.Card} target = "_blank" href = "https://rinkeby.etherscan.io/token/0xc29cd7fc753d1920647fd950b46a885ea8e5b679" >
                        <div style = {{textAlign : "center"}} >
                            <h2>FIL NFT</h2>
                            <p style = {{marginTop : "-0.5rem"}} >FILN</p>
                        </div>
                        <img src = {FILN} style = {styles.NFTIMG} />
                        <h1>QTY : 1</h1>
                    </a>
                    <a style = {styles.Card} target = "_blank" href = "https://rinkeby.etherscan.io/tx/0x43ed7d40b3feaf813d35e1abb88a0c33eea44523e0822942e45e7f0e6b7e92f2" >
                        <div style = {{textAlign : "center"}} >
                            <h2>Bored Ape</h2>
                            <p style = {{marginTop : "-0.5rem"}} >BAP</p>
                        </div>
                        <img src = {BAP} style = {styles.NFTIMG} />
                        <h1>QTY : 1</h1>
                    </a>
                    <a style = {styles.Card} target = "_blank" href = "https://rinkeby.etherscan.io/tx/0x43ed7d40b3feaf813d35e1abb88a0c33eea44523e0822942e45e7f0e6b7e92f2" >
                        <div style = {{textAlign : "center"}} >
                            <h2>Crypto Punk</h2>
                            <p style = {{marginTop : "-0.5rem"}} >CP</p>
                        </div>
                        <img src = {CP} style = {styles.NFTIMG} />
                        <h1>QTY : 1</h1>
                    </a>
                    <a style = {styles.Card} target = "_blank" href = "https://rinkeby.etherscan.io/tx/0x43ed7d40b3feaf813d35e1abb88a0c33eea44523e0822942e45e7f0e6b7e92f2" >
                        <div style = {{textAlign : "center"}} >
                            <h2>NFT Yourself</h2>
                            <p style = {{marginTop : "-0.5rem"}} >NFTY</p>
                        </div>
                        <img src = {NFTY} style = {styles.NFTIMG} />
                        <h1>QTY : 1</h1>
                    </a>
                </div>
            </div>
            <Transfer handeModalChange = {handeModalChange} active = {active} currency = "ETH" balance = {ETH?.balance} value = {ETH?.balance * 18000} address = "0xh1jn3iu12iu31h2niu3123hm12u3ng2123g" history = {ETH?.history} />
        </>
    )
}

export default NFT