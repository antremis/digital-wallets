import React from'react'
import Table from './Table/Table'

const ChainInfo = ({currency, balance, value, address, refresh, txuri, adduri, history, handeModalChange}) => {

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
            justifyContent : "space-between",
        },
        Balance : {
            fontSize : "3em",
            fontWeight : "400",
        },
        Value : {
            fontSize : "0.8em",
            marginTop : "-1.8em"
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
        <div style = {styles.Container} >
            <div style={styles.FlexContainer} >
                <h1 style = {styles.Balance} >{balance} {currency}</h1>
                <p style = {styles.Value} >₹{value}</p>
                <div style = {styles.Address} onClick={() => {navigator.clipboard.writeText(address)}} >
                    <p>{`${address?.slice(0, 10)}....${address?.slice(address?.length-4, address?.length)}`}</p>
                    <ion-icon name="copy-outline" style = {styles.Copy} />
                </div>
                <div style = {styles.Send} onClick = {() => handeModalChange("open")} >Send</div>
            </div>
            <Table 
                headers = {[
                    "Transaction ID",
                    "Type",
                    "From/To",
                    "Amount",
                    "Date",
                    "Status"
                ]}
                minCellWidth = "120"
                history = {history}
                maxWidth = "88vw"
                refresh = {refresh}
                maxHeight = "50vh"
                txuri = {txuri}
                adduri = {adduri}
            />
        </div>
    )
}

export default ChainInfo