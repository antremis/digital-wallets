import React, {useState} from'react'

const Transfer = ({name, address, active, handeModalChange, transfer}) => {

    const [to, setTo] = useState("")
    const [value, setValue] = useState("")

    const validate = () => {
        if(to && value){
            return false
        }
        else{
            return true
        }
    }

    const styles = {
        FlexContainer : {
            display : "flex",
            width : "25vw",
            height : "100vh",
            backgroundColor : "white",
            position : "absolute",
            top : "0",
            right : "0",
            flexDirection : "column",
            boxShadow : "0 0 0 100vw rgba(60, 60, 25, 0.5), 0 -0.5rem 2.5rem 0.8rem rgba(0, 0, 0, 0.3)",
            padding : "2rem 0 1rem 0",
            gap : "3rem",
            alignItems : "center",
            transition : "transform 0.2s, opacity 0.2s",
        },
        Header : {
            textAlign : "center",
        },
        HeaderTitle : {
            fontSize : "2rem",
            fontWeight : "700",
        },
        HeaderText : {
            fontSize : "1.2rem",
        },
        InputText : {
            display : "flex",
            flexDirection : "column",
            gap : "0.3rem",
            fontSize : "1.2rem",
            width : "90%",
        },
        Input : {
            padding : "1rem",
            width : "100%",
            fontSize : "1.8rem",
            backgroundColor : "var(--clr-white-fill)",
        },
        Label : {
            fontFamily : "font-bold",
            fontSize : "1.8rem",
        },
        HR : {
            width : "100%",
            height : "0.1rem",
            backgroundColor : "var(--clr-hr)",
        },
        Close : {
            fontSize : "1.5rem",
            position : "absolute",
            top : "2rem",
            right : "2rem",
            cursor : "pointer",
        },
        BottomHR : {
            width : "100%",
            height : "0.1rem",
            backgroundColor : "var(--clr-hr)",
            marginTop : "auto",
        },
        BottomOptions : {
            display : "flex",
            width : "90%",
            justifyContent : "space-between",
            alignItems : "center",
            margin : "-1rem 0 1rem 0",
        },
        Submit : {
            padding : "1.8rem",
            cursor : "pointer",
            fontSize : "1.8rem",
        },
        Cancel : {
            color : "var(--clr-icon-highlight)",
            cursor : "pointer",
            fontSize : "1.8rem",
        }
    }

    return(
        <form style = {{...styles.FlexContainer, ...active}} onSubmit = {(e) => transfer(e, to, value)} >
            <div style = {styles.Header} >
                <p style = {styles.HeaderTitle} >Send</p>
                <p style = {styles.HeaderText} >Ethereum Main Network</p>
            </div>
            <div style = {styles.InputText} >
                <label style = {styles.Label} >From</label>
                <p style = {styles.Input} >{`${address?.slice(0, 10)}....${address?.slice(address?.length-4, address?.length)}`}</p>
            </div>
            <div style = {styles.InputText} >
                <label style = {styles.Label} >To</label>
                <input data-attribute = "input" type = "text" style = {styles.Input} value = {to} placeholder = "Search Username" onChange = {(e) => {setTo(e.target.value)}}/> 
            </div>
            <hr style = {styles.HR} />
            <div style = {styles.InputText} >
                <label style = {styles.Label} >Amount</label>
                <input data-attribute = "input" type = "text" style = {styles.Input} value = {value} placeholder = "0" onChange = {(e) => {setValue(e.target.value)}}/>
            </div>
            <hr style = {styles.BottomHR} />
            <div style = {styles.BottomOptions}>
                <p style = {styles.Cancel} onClick = {() => handeModalChange("close")} >Cancel</p>
                <button data-attribute = "transfer-btn" disabled = {validate()} style = {styles.Submit} >Transfer now</button>
            </div>
            <p style = {styles.Close} onClick = {() => handeModalChange("close")} >x</p>
        </form>
    )
}

export default Transfer