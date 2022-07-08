import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext'
import USDT from "../assets/Icons/NFT placeholder/USDT.svg"
import DAI from "../assets/Icons/NFT placeholder/DAI.svg"
import HMT from "../assets/Icons/NFT placeholder/helixmeta.jpg"
import USP from "../assets/Icons/NFT placeholder/uniswap.svg"
import Transfer from './Transfer'

const Tokens = () => {

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
        },
        NFTIMG : {
            width : "20rem",
            height : "20rem",
        },
    }

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
                </div>
                <div style = {styles.CardWrapper} >
                    <a style = {styles.Card} target = "_blank" href = "https://etherscan.io/tx/0xb0af5be39001ccf07a44d407041ef4f98ad89721d9de3a96921f0937dc78f678">
                        <div style = {{textAlign : "center"}} >
                            <h2>FIL Token</h2>
                            <p style = {{marginTop : "-0.5rem"}} >FILT</p>
                        </div>
                        <img src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAADJCAMAAAC+GOY3AAAApVBMVEWCNYsQEhWudBMAcK7///9ksy7kIBz/2kX3phTDxMRAOzEhYaXqTDf5tzfs2VlrtFe/ejH96cX704r/9tH/7aLgzOLr3MT4x8aLxmLY7Mu/2+uAuNf5vE9AlMLrWFX/43T/8br6yGz82Jn/4Wj83qf7zXv/+vH4rCP4sTH/6Iv/31zk4dzw3sz25tzweGn+9OL+79T/5n//767w44KPx4Hi8Ocggri6wNcUAAACT0lEQVR4nO3Wi05TQRhF4aOiiFfKqVTxRhERVCxe3//RNFXgJM5WcXYyO5O1XuDfX9p0Omx10sZwrZO2kMSFJC8keSHJC0leSPJCkheSvJDkhSQvJHn1JLnTSe+G6520iyQuJHkhyQtJXkjyQpIXkryQ5IUkLySijf9vt/I0EhESi2TbWYXkfeXp0+GWswrJovL0Akk5JEgmIREhQTIJiQgJkklIRGLlC+uRckhESAwhESExhESExNBiuOdMSD5Yj5Q7HW47E5Jn1iPlZkjKITGERITEEBIREkP1kuXOJCE53Pl7y+aSmVh/1V73Ijl604vkoHpHiuS4F8lh7YwYSf3vdIhkVg1JkdQ+JjGSVT0kRFL7KsZIql/FGEn1q+iRHMwmialnsz92bID8kNx3JiRL65Fyq2HTmZC8tB4pNyIph8QQEhESQ0guO5lPEpL9ueqVA7GuXjKK9f/WWwfi5462kn2H4deOthLfl6uxZHQQznc0lXx0EM53tJSsHIKLHS0lJw7BxY6GkiPfT/BmW8ncAbjc0VBi/UhaSoyv4npHO4nxVVzvqJZ8GieJ0Wfj75k/Ev7Vq5pKHjgTks/WI+VWw01nQvLYeqTcEyTlkBhCIkJiCIkIiSEkIiSGkIiQGEIiQmIIiQiJISSippKHzoTki/VIua/DDWdC8tx6pNweknJIDCERITGERITEEBLR03LfrEfKmSUNQ5IXkryQ5IUkLyR59SS520l7Qy89aj3AFpK8kOSFJC8keSHJC0leSPJCkheSvJDkhSSvjiTfAQKQokPiVAHUAAAAAElFTkSuQmCC" style = {styles.NFTIMG} />
                        <h1>QTY : 1</h1>
                    </a>
                    <a style = {styles.Card} target = "_blank" href = "https://etherscan.io/tx/0xd3ad1911f125599f52a58d7a67de9c561fc9eaab113b4a02b282d6f10700c911">
                        <div style = {{textAlign : "center"}} >
                            <h2>Tether USD</h2>
                            <p style = {{marginTop : "-0.5rem"}} >ISDT</p>
                        </div>
                        <img src = {USDT} style = {styles.NFTIMG} />
                        <h1>QTY : 1</h1>
                    </a>
                    <a style = {styles.Card} target = "_blank" href = "https://etherscan.io/tx/0x036f5c831a004aca062469055364f4f727f4721781847bfa6be652bb889aafcc">
                        <div style = {{textAlign : "center"}} >
                            <h2>Uniswap</h2>
                            <p style = {{marginTop : "-0.5rem"}} >UNI</p>
                        </div>
                        <img src = {USP} style = {styles.NFTIMG} />
                        <h1>QTY : 3</h1>
                    </a>
                    <a style = {styles.Card} target = "_blank" href = "https://etherscan.io/tx/0x16e5c9282bf6d832fcd196461ad100620ea07c8b0d79f4ab87abb221dbb05df8" >
                        <div style = {{textAlign : "center"}} >
                            <h2>DAI</h2>
                            <p style = {{marginTop : "-0.5rem"}} >DAI</p>
                        </div>
                        <img src = {DAI} style = {styles.NFTIMG} />
                        <h1>QTY : 2</h1>
                    </a>
                    <a style = {styles.Card} target = "_blank" href = "https://etherscan.io/tx/0x70c876626af63d69c004f9ad886fc919a80fa30eb447f9317799ddcaa4576c32" >
                        <div style = {{textAlign : "center"}} >
                            <h2>Helix Meta Token</h2>
                            <p style = {{marginTop : "-0.5rem"}} >HMT</p>
                        </div>
                        <img src = {HMT} style = {styles.NFTIMG} />
                        <h1>QTY : 1</h1>
                    </a>
                </div>
            </div>
            <Transfer handeModalChange = {handeModalChange} active = {active} currency = "ETH" balance = {ETH?.balance} value = {ETH?.balance * 18000} address = "0xh1jn3iu12iu31h2niu3123hm12u3ng2123g" history = {ETH?.history} />
        </>
    )
}

export default Tokens