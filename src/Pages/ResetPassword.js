import React, { useState } from'react'
import { useAuthContext } from '../Context/AuthContext'
import Logo from "../assets/Icons/logo.svg"
import { Link, useNavigate } from 'react-router-dom'

const ResetPasswword = () => {

    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')
    const {resetPassword} = useAuthContext()
    const navigation = useNavigate()

    
    const validate = () => {
        if(pass1 && pass2 && pass1 === pass2) {
            return true
        }
        else {
            return false
        }
    }

    const styles = {
        Container : {
            display : "flex",
            flexDirection : "column",
            alignItems : "center",
            justifyContent : "center",
            height : "100%",
            width : "100%",
            backgroundColor : "var(--clr-white-fill)",
        },
        TextWrapper : {
            display : "flex",
            flexDirection : "column",
            gap : "1rem",
            width : "60ch",
            textAlign : "center",
            overflowWrap : "break-word",
            margin : "5rem 0 3rem 0",
        },
        Welcome : {
            fontSize : "2rem",
        },
        Text : {
            overflowWrap : "break-word",
            whiteSpace : "pre-wrap",
            marginTop : "-1rem",
        },
        Form : {
            backgroundColor : "white",
            display : "flex",
            flexDirection : "column",
            padding : "2rem 2rem 4rem 2rem",
            fontSize : "1.5rem",
            fontWeight : "600",
        },
        Label : {
            cursor : "pointer",
        },
        Input : {
            padding : "1rem",
            backgroundColor : "var(--clr-white-fill)",
            width : "70ch",
            marginBottom : "2rem",
            borderBottom : "1px solid var(--clr-white-border)",
        },
        Button : {
            color : "white",
            backgroundColor : validate ? "var(--clr-icon-highlight)" : "var(--clr-white-dark)",
            width : "100%",
            padding : "1rem 0",
            cursor : "pointer",
        },
        Back : {
            color : "var(--clr-icon-highlight)",
            display : "flex",
            alignItems : "center",
            gap : "0.4rem",
            fontSize : "1.2rem",
            marginTop : "2rem",
        },
        PasswordCheckWrapper : {
            fontWeight : "400",
            fontSize : "1rem",
            border : "1px solid var(--clr-white-dark)",
            margin : "0 0 2rem 0",
            padding : "2rem",
        },
        PasswordCheck : {
            margin : "1rem 0 0 2rem",
            color : "var(--clr-white-dark)",
        },
    }

    const handleSubmit = (e) => {
        console.log(pass1)
        e.preventDefault()
        resetPassword(pass1)
        navigation('/login')
    }

    return (
        <div style = {styles.Container} >
            <img src = {Logo} />
            <div style = {styles.TextWrapper}>
                <h1 style = {styles.Welcome} >Password Recovery</h1>
                <p style = {styles.Text} >Enter the email address associated with your account and we'll send you an OTP to reset your password</p>
            </div>
            <form style = {styles.Form} onSubmit = {handleSubmit} >
                <label style = {styles.Label} htmlFor = "signup-email" >Password</label>
                <input style = {styles.Input} id = "signup-email" type="password" placeholder = "********" value = {pass1} onChange = {(e) => setPass1(e.target.value)} />
                <div style = {styles.PasswordCheckWrapper} >
                    <p>The password must include:</p>
                    <ul style = {styles.PasswordCheck} >
                        <li>8 - 16 characters</li>
                        <li>At least one uppercase character</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                    </ul>
                </div>
                <label style = {styles.Label} htmlFor = "signup-password" >Retype Password</label>
                <input style = {styles.Input} id = "signup-password" type="password" placeholder = "********" value = {pass2} onChange = {(e) => setPass2(e.target.value)} />
                <button style = {styles.Button} type="submit" >Reset</button>
            </form>
        </div>
    )
}

export default ResetPasswword