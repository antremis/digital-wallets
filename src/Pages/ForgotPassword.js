import React, { useState } from'react'
import { useAuthContext } from '../Context/AuthContext'
import Logo from "../assets/Icons/logo.svg"
import { Link, useNavigate } from 'react-router-dom'

const PasswordRecover = () => {

    const [email, setEmail] = useState('')
    const {getOTP} = useAuthContext()
    const navigate = useNavigate()

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
        Recover : {
            color : "white",
            backgroundColor : email ? "var(--clr-icon-highlight)" : "var(--clr-white-dark)",
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
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        getOTP(email)
        .catch(err => console.log(err))
        navigate('/otp')
    }

    return (
        <div style = {styles.Container} >
            <img src = {Logo} />
            <div style = {styles.TextWrapper}>
                <h1 style = {styles.Welcome} >Password Recovery</h1>
                <p style = {styles.Text} >Enter the email address associated with your account and we'll send you an OTP to reset your password</p>
            </div>
            <form style = {styles.Form} onSubmit = {handleSubmit} >
                <label style = {styles.Label} htmlFor = "recovery-email" >Email</label>
                <input style = {styles.Input} id = "recovery-email" type="email" placeholder = "john.doe@fil.com" value = {email} onChange = {(e) => setEmail(e.target.value)} />
                <button style = {styles.Recover} type="submit" disabled={email ? false : true}  >Continue</button>
            </form>
            <Link to = "/login" style = {styles.Back} >
                <ion-icon name="arrow-back-outline" />
                Back
            </Link>
        </div>
    )
}

export default PasswordRecover