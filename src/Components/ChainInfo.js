import React from'react'
import Table from './Table/Table'

const ChainInfo = ({currency, balance, value, address, history, handeModalChange, refresh, txuri, adduri}) => {

    const styles = {
        Container : {
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-between",
            width : "100%",
            height : "100%",
            padding : "1rem 0",
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
                headers={[
                    "Transaction ID",
                    "Transfer Type",
                    "From/To",
                    "Amount",
                    "Date",
                    "Status",
                  ]}
                minCellWidth={120}
                history = {history}
                maxWidth = "89vw"
                maxHeight = "50vh"
                refresh = {refresh}
                txuri = {txuri}
                adduri = {adduri}
            />
        </div>
    )
}

export default ChainInfo