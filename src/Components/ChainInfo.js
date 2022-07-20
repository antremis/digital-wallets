import React from'react'
import Table from './Table/Table'

const ChainInfo = ({currency, balance, value, address, refresh, txuri, adduri, history, handeModalChange, headers}) => {

    const styles = {
        Container : {
            display : "flex",
            flexDirection : "column",
            width : "100%",
            height : "100%",
            padding : "2rem 0",
            justifyContent : "space-between",
        },
        FlexContainer : {
            display : "flex",
            flexDirection : "column",
            alignItems : "center",
            gap : "1rem",
            fontSize : "1.2rem",
            justifyContent : "space-between",
        },
        Balance : {
            fontSize : "4.6rem",
            fontFamily : "font-light",
        },
        Value : {
            fontSize : "1.4rem",
            marginTop : "-1rem"
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
            fontSize : "1.8rem",
            padding : "1.8rem",
            cursor : "pointer",
            backgroundColor : "var(--clr-green)",
            marginTop : "0.2rem",
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
                <p style = {styles.Balance} >
                    {
                        balance
                        ? `${balance} ${currency}`
                        : "Loading..."
                    }
                </p>
                <p style = {styles.Value} >
                    {
                        value 
                        ? `£${value}`
                        : "Loading..."
                    }
                </p>
                <div style = {styles.Address} onClick={() => {navigator.clipboard.writeText(address)}} >
                    <p>
                        {
                            address 
                            ? address.slice(0, 10) + "...." + address.slice(address.length-4, address.length)
                            : "Loading..."
                        }
                    </p>
                    <ion-icon name="copy-outline" style = {styles.Copy} />
                </div>
                <div style = {styles.Send} onClick = {() => handeModalChange("open")} >Send</div>
            </div>
            <Table 
                headers = {headers ? headers : [
                    "Transaction ID",
                    "Type",
                    "From/To",
                    "Amount",
                    "Date",
                    "Status"
                ]}
                minCellWidth = "120"
                history = {history}
                width = "87vw"
                refresh = {refresh}
                maxHeight = "38vh"
                txuri = {txuri}
                adduri = {adduri}
            />
        </div>
    )
}

export default ChainInfo