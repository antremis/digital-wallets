import React, { useState } from'react'
import { useUserContext } from '../Context/UserContext'
import Transfer from './Transfer'

const NFT = () => {

    const {ETH, NFT, prices} = useUserContext()
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
            maxHeight : "50vh",
            flex : 1,
            gap : "5rem",
            overflowY : "scroll",
            justifyContent : "center",
            flexWrap : "wrap",
        },
        Card : {
            display : "flex",
            flexDirection : "column",
            alignItems : "center",
            cursor : "pointer",
        },
        NFTIMG : {
            width : "31rem",
            height : "31rem",
        },
    }

    return(
        <>
            <div style = {styles.Container} >
                <div style={styles.FlexContainer} >
                    <p style = {styles.Balance} >{ETH?.balance} {"ETH"}</p>
                    <p style = {styles.Value} >₹{(prices?.ETH*ETH?.balance).toFixed(5)}</p>
                    <div style = {styles.Address} onClick={() => {navigator.clipboard.writeText(ETH?.address)}} >
                        <p>{`${ETH?.address?.slice(0, 10)}....${ETH?.address?.slice(ETH?.address?.length-4, ETH?.address?.length)}`}</p>
                        <ion-icon name="copy-outline" style = {styles.Copy} />
                    </div>
                    {/* <div style = {styles.Send} onClick = {() => handeModalChange("open")} >Send</div> */}
                </div>
                <div style = {styles.CardWrapper} >
                    {
                        NFT?.map((item, index) => (
                                item.image_url
                                ?   (<a key = {index} data-attribute = "asset-card" style = {styles.Card} target = "_blank" rel="noreferrer" href = {item.permalink} >
                                        {
                                            item.image_url
                                            ? <div style = {{...styles.NFTIMG, backgroundImage : `url(${item.image_url})`, backgroundPosition : "center", backgroundSize : "cover"}} />
                                            : <div style = {{...styles.NFTIMG, backgroundImage : `url(https://emedicodiary.com/images/queimg/no-image-found.png)`, backgroundPosition : "center", backgroundSize : "cover"}} />
                                        }
                                        <div style = {{textAlign : "center"}} >
                                            <p style = {{marginTop : "2rem", fontSize : "1.6rem"}}>{item.name}</p>
                                            <h2 style = {{fontSize : "2.6rem"}}>{item.symbol} {`#${item.token_id}`}</h2>
                                            <p style = {{marginBottom : "2rem", fontSize : "2rem"}}>8K ETH time</p>
                                        </div>
                                    </a>)
                                : null
                            ))
                    }
                </div>
            </div>
            <Transfer handeModalChange = {handeModalChange} active = {active} currency = "ETH" balance = {ETH?.balance} value = {ETH?.balance * 18000} address = "0xh1jn3iu12iu31h2niu3123hm12u3ng2123g" history = {ETH?.history} />
        </>
    )
}

export default NFT