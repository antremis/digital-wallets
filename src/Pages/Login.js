import React, { useState } from'react'
import { useAuthContext } from '../Context/AuthContext'
import { Link } from 'react-router-dom'
import Logo from "../assets/Icons/logo.svg"

const Login = () => {

    const [login, setLogin] = useState({transform : "translateX(0)"})
    const [signup, setSignup] = useState({transform : "translateX(100%)"})
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {handleLogin, handleSignup} = useAuthContext()

    const styles = {
        Container : {
            display : "flex",
            flexDirection : "column",
            alignItems : "center",
            justifyContent : "center",
            height : "100%",
            width : "100%",
            backgroundColor : "var(--clr-white-dark)",
        },
        FlexContainer : {
            display : "flex",
            alignItems : "flex-end",
            gap : "0.2rem",
        },
        Logo : {
            width : "4rem",
            height : "4rem",
            backgroundColor : "red",
        },
        Text : {
            color : "var(--clr-header)",
        },
        Title : {
            fontSize : "2.5rem",
        },
        Subtitle : {
            fontSize : "0.8rem",
            letterSpacing : "2px",
            marginTop : "-0.5rem"
        },
        Welcome : {
            fontSize : "2rem",
            margin : "5rem 0 3rem 0",
        },
        FormWrapper : {
            display : "grid",
            gridTemplateColumns : "1fr",
            overflow : "hidden",
        },
        LoginForm : {
            gridRow : "1 / 2",
            gridColumn : "1 / 2",
            transition : "transform 0.3s",
            transform : "translateX(-100%)",
        },
        SignupForm : {
            gridRow : "1 / 2",
            gridColumn : "1 / 2",
            transition : "transform 0.3s",
            transform : "translateX(100%)",
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
            backgroundColor : "var(--clr-white-dark)",
            width : "70ch",
            marginBottom : "2rem",
        },
        Login : {
            color : "white",
            backgroundColor : email && password ? "var(--clr-icon-highlight)" : "var(--clr-white-darker)",
            width : "100%",
            padding : "1rem 0",
            cursor : "pointer",
        },
        OptionWrapper : {
            display : "flex",
            justifyContent : "space-between",
            width : "100%",
            fontSize : "1.2rem",
            marginTop : "1rem",
        },
        Underline : {
            borderBottom : "1px solid var(--clr-header)",
            color : "var(--clr-header)",
            cursor : "pointer",
        },
        PasswordCheckWrapper : {
            fontWeight : "400",
            fontSize : "1rem",
            border : "1px solid var(--clr-white-darker)",
            margin : "0 0 2rem 0",
            padding : "2rem",
        },
        PasswordCheck : {
            margin : "1rem 0 0 2rem",
            color : "var(--clr-white-darker)",
        },
    }

    const handleFormChange = (type) => {
        if(type === "login") {
            setLogin({transform : "translateX(0)"})
            setSignup({transform : "translateX(100%)"})
        }
        else {
            setLogin({transform : "translateX(-100%)"})
            setSignup({transform : "translateX(0)"})
        }
    }

    const handleSubmit = (e, type) => {
        e.preventDefault()
        if(type === "login"){
            handleLogin(email, password)
        }
        else {
            handleSignup(email, password)
            .then(data => console.log(data))
        }
    }

    return (
        <div style = {styles.Container} >
            <div style = {styles.FlexContainer} >
                <img src = {Logo} />
            </div>
            <h1 style = {styles.Welcome} >Welcome!</h1>
            <div style = {styles.FormWrapper} >
                <div style = {{...styles.LoginForm, ...login}} >
                    <form style = {styles.Form} onSubmit = {(e) => handleSubmit(e, "login")} >
                        <label style = {styles.Label} htmlFor = "loginemail" >Email</label>
                        <input style = {styles.Input} id = "login-email" type="text" placeholder = "john.doe@fil.com" value = {email} onChange = {(e) => setEmail(e.target.value)} />
                        <label style = {styles.Label} htmlFor = "login-password" >Password</label>
                        <input style = {styles.Input} id = "login-password" type="password" placeholder = "********" value = {password} onChange = {(e) => setPassword(e.target.value)} />
                        <button style = {styles.Login} type="submit" >Login</button>
                    </form>
                    <div style = {styles.OptionWrapper} >
                        <Link to = "/recover" style = {styles.Underline} >Forgot My Password</Link>
                        <p>Don't Have An Account? <span style = {styles.Underline} onClick = {() => handleFormChange("signup")} >SignUp</span></p>
                    </div>
                </div>
                <div style = {{...styles.SignupForm, ...signup}} >
                    <form style = {styles.Form} onSubmit = {(e) => handleSubmit(e, "signup")} >
                        <label style = {styles.Label} htmlFor = "signup-email" >Email</label>
                        <input style = {styles.Input} id = "signup-email" type="email" placeholder = "john.doe@fil.com" value = {email} onChange = {(e) => setEmail(e.target.value)} />
                        <label style = {styles.Label} htmlFor = "signup-password" >Password</label>
                        <input style = {styles.Input} id = "signup-password" type="password" placeholder = "********" value = {password} onChange = {(e) => setPassword(e.target.value)} />
                        <div style = {styles.PasswordCheckWrapper} >
                            <p>The password must include:</p>
                            <ul style = {styles.PasswordCheck} >
                                <li>8 - 16 characters</li>
                                <li>At least one uppercase character</li>
                                <li>At least one number</li>
                                <li>At least one special character</li>
                            </ul>
                        </div>
                        <button style = {styles.Login} type="submit" >Login</button>
                    </form>
                    <div style = {styles.OptionWrapper} >
                        <p>Already have an account? <span style = {styles.Underline} onClick = {() => handleFormChange("login")} >Login</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login