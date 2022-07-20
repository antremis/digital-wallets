import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext'
import Transfer from './Transfer'

const Tokens = () => {

    const {ETH, TOK, prices, transferTOK} = useUserContext()
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
    }

    return(
        <>
            <div style = {styles.Container} >
                <div style={styles.FlexContainer} >
                    <p style = {styles.Balance} >{ETH?.balance} {"ETH"}</p>
                    <p style = {styles.Value} >£{(prices?.ETH*ETH?.balance).toFixed(5)}</p>
                    <div style = {styles.Address} onClick={() => {navigator.clipboard.writeText(ETH?.address)}} >
                        <p>{`${ETH?.address?.slice(0, 10)}....${ETH?.address?.slice(ETH?.address?.length-4, ETH?.address?.length)}`}</p>
                        <ion-icon name="copy-outline" style = {styles.Copy} />
                    </div>
                </div>
                <div style = {styles.CardWrapper} >
                    {
                        TOK?.map((item, index) => (
                            <div key = {index} data-attribute = "asset-card" style = {styles.Card} >
                                <a target = "_blank" rel="noreferrer" href = {`https://rinkeby.etherscan.io/token/${item.address}`} ><img src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAADJCAMAAAC+GOY3AAAApVBMVEWCNYsQEhWudBMAcK7///9ksy7kIBz/2kX3phTDxMRAOzEhYaXqTDf5tzfs2VlrtFe/ejH96cX704r/9tH/7aLgzOLr3MT4x8aLxmLY7Mu/2+uAuNf5vE9AlMLrWFX/43T/8br6yGz82Jn/4Wj83qf7zXv/+vH4rCP4sTH/6Iv/31zk4dzw3sz25tzweGn+9OL+79T/5n//767w44KPx4Hi8Ocggri6wNcUAAACT0lEQVR4nO3Wi05TQRhF4aOiiFfKqVTxRhERVCxe3//RNFXgJM5WcXYyO5O1XuDfX9p0Omx10sZwrZO2kMSFJC8keSHJC0leSPJCkheSvJDkhSQvJHn1JLnTSe+G6520iyQuJHkhyQtJXkjyQpIXkryQ5IUkLySijf9vt/I0EhESi2TbWYXkfeXp0+GWswrJovL0Akk5JEgmIREhQTIJiQgJkklIRGLlC+uRckhESAwhESExhESExNBiuOdMSD5Yj5Q7HW47E5Jn1iPlZkjKITGERITEEBIREkP1kuXOJCE53Pl7y+aSmVh/1V73Ijl604vkoHpHiuS4F8lh7YwYSf3vdIhkVg1JkdQ+JjGSVT0kRFL7KsZIql/FGEn1q+iRHMwmialnsz92bID8kNx3JiRL65Fyq2HTmZC8tB4pNyIph8QQEhESQ0guO5lPEpL9ueqVA7GuXjKK9f/WWwfi5462kn2H4deOthLfl6uxZHQQznc0lXx0EM53tJSsHIKLHS0lJw7BxY6GkiPfT/BmW8ncAbjc0VBi/UhaSoyv4npHO4nxVVzvqJZ8GieJ0Wfj75k/Ev7Vq5pKHjgTks/WI+VWw01nQvLYeqTcEyTlkBhCIkJiCIkIiSEkIiSGkIiQGEIiQmIIiQiJISSippKHzoTki/VIua/DDWdC8tx6pNweknJIDCERITGERITEEBLR03LfrEfKmSUNQ5IXkryQ5IUkLyR59SS520l7Qy89aj3AFpK8kOSFJC8keSHJC0leSPJCkheSvJDkhSSvjiTfAQKQokPiVAHUAAAAAElFTkSuQmCC" alt = "FIL Token" style = {styles.NFTIMG} /></a>
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