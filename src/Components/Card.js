import React from 'react'

const Card = ({uri, name, currency, balance, value, address}) => {

    const styles = {
        Card : {
            border : "1px solid var(--clr-white-dark)",
            padding : "1.5rem 2rem",
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-between",
        },
        Header : {
            display : "flex",
            fontSize : "2rem",
            fontWeight : "600",
            alignItems : "center",
            gap : "0.5rem",
            letterSpacing : "0rem",
        },
        Icon : {
            width : "5rem",
            aspectRatio : "1/1"
        },
        Balance : {
            fontSize : "4.6em",
        },
        Value : {
            fontSize : "1.4em",
            marginTop : "-1em"
        },
        Address : {
            fontSize : "1.6rem",
            padding : "1.2rem 3rem",
            borderRadius : "100vw",
            backgroundColor : "var(--clr-white-dark)",
            display : "flex",
            justifyContent : "space-between",
            alignItems : "center",
            cursor : "pointer",
        },
    }

    return (
        <div style = {styles.Card} >
            <div style = {styles.Header} >
                <img src = {uri} style = {styles.Icon} alt = {name} />
                <p>{name}</p>
            </div>
            <div>
                <p style = {styles.Balance} >{balance} {currency}</p>
                <p style = {styles.Value} >INR {value}</p>
            </div>
            <div style = {styles.Address} onClick={() => {navigator.clipboard.writeText(address)}} >
                <p>{`${address.slice(0, 10)}....${address.slice(address.length-4, address.length)}`}</p>
                <ion-icon name="copy-outline" style = {styles.Copy}/>
            </div>
        </div>
    )
}

export default Card