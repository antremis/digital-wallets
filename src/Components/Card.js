import React from 'react'
import { Link } from 'react-router-dom'

const Card = ({uri, name, currency, balance, value, address, url}) => {
    balance = parseFloat(balance)
    const styles = {
        Card : {
            padding : "1.5rem 2rem",
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-between",
        },
        Header : {
            display : "flex",
            fontSize : "2.4rem",
            fontFamily : "font-bold",
            alignItems : "center",
            gap : "0.5rem",
            letterSpacing : "0rem",
        },
        Icon : {
            width : "5rem",
            aspectRatio : "1/1"
        },
        Balance : {
            fontSize : "calc(33vw / 20)",
            fontFamily : "font-bold",
        },
        Value : {
            fontSize : "1.4rem",
            fontFamily : "font-light",
            marginTop : "-0.2em"
        },
        Address : {
            fontSize : "1.6rem",
            padding : "1.2rem 3rem",
            borderRadius : "100vw",
            backgroundColor : "var(--clr-white-fill)",
            display : "flex",
            justifyContent : "space-between",
            alignItems : "center",
            cursor : "pointer",
        },
    }

    return (
        <Link data-attribute = "asset-card" style = {styles.Card} to = {url}>
            <div style = {styles.Header} >
                <img src = {uri} style = {styles.Icon} alt = {name} />
                <p>{name}</p>
            </div>
            <div>
                {/* <p style = {styles.Balance} >{balance.toFixed(8)} {currency}</p> */}
                <p style = {styles.Balance} >{balance} {currency}</p>
                <p style = {styles.Value} >£{value}</p>
            </div>
            <div style = {styles.Address} onClick={() => {navigator.clipboard.writeText(address)}} >
                <p>{`${address.slice(0, 10)}....${address.slice(address.length-4, address.length)}`}</p>
                <ion-icon name="copy-outline" style = {styles.Copy}/>
            </div>
        </Link>
    )
}

export default Card