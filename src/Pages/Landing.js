import React, {useState} from'react'
import { Link, Outlet } from 'react-router-dom';
import Header from '../Components/Header'
import { useAuthContext } from '../Context/AuthContext';
import Account from "../assets/Icons/Main Nav/account.svg";
import Wallet from "../assets/Icons/Main Nav/wallet.svg";
import Logout from "../assets/Icons/Main Nav/logout.svg";

const Landing = () => {

    const [wallet, setWallet] = useState({filter: "invert(52%) sepia(7%) saturate(618%) hue-rotate(178deg) brightness(92%) contrast(91%)",});
    const [account, setAccount] = useState({filter: "invert(29%) sepia(55%) saturate(2436%) hue-rotate(180deg) brightness(91%) contrast(98%)", borderRight : "2px solid black"});
    const {signOut, user, admin} = useAuthContext();

    const styles = {
        MAIN : {
            minHeight : "90vh",
        },
        FlexContainer : {
            display : "flex",
            width : "100%",
            minHeight : "90vh",
        },
        SideNav : {
            width : "5vw",
            backgroundColor : "var(--clr-white-fill)",
            flexDirection : "column",
            alignItems : "center",
            padding : "2rem 0",
            borderRight : "1px solid var(--clr-white-border)",
        },
        SideNavItem : {
            fontSize : "0.9rem",
            display : "flex",
            flexDirection : "column",
            justifyContent : "center",
            alignItems : "center",
            cursor : "pointer",
    	    transitionDuration : "0.2s",
            border : "2px solid transparent",
            gap : "0.2rem",
            filter: "invert(52%) sepia(7%) saturate(618%) hue-rotate(178deg) brightness(92%) contrast(91%)",
        },
        Icons : {
            width : "3rem",
            height : "3rem",
        },
        OutletWrapper : {
            width : "100%",
            padding : "1rem 3rem",
        },
        font : {
            fontSize : "1.2rem"
        }
    }

    const handleIconClick = (icon) => {
        setWallet({filter: "invert(52%) sepia(7%) saturate(618%) hue-rotate(178deg) brightness(92%) contrast(91%)", borderRight : "2px solid transparent"});
        setAccount({filter: "invert(52%) sepia(7%) saturate(618%) hue-rotate(178deg) brightness(92%) contrast(91%)", borderRight : "2px solid transparent"});
        if(icon === "wallet") {
            setWallet({filter: "invert(29%) sepia(55%) saturate(2436%) hue-rotate(180deg) brightness(91%) contrast(98%)", borderRight : "2px solid black"});
        }
        if(icon === "account") {
            setAccount({filter: "invert(29%) sepia(55%) saturate(2436%) hue-rotate(180deg) brightness(91%) contrast(98%)", borderRight : "2px solid black"});
        }
    }

    return(
        <div style = {styles.MAIN}>
            <Header />
            <div style = {styles.FlexContainer} >
                <div style = {{...styles.FlexContainer, ...styles.SideNav}}>
                    <div style = {{marginTop : "auto", width : "100%"}}>
                        <Link style = {{...styles.SideNavItem, ...wallet, marginBottom : "3rem"}} to = "/wallet" onClick = {() => {handleIconClick("wallet")}} >
                            <img style = {styles.Icons} src = {Wallet} />
                            <p style = {styles.font}>Wallets</p>
                        </Link>
                        <Link style = {{...styles.SideNavItem, ...account}} to = "/accounts" onClick = {() => {handleIconClick("account")}} >
                            <img style = {styles.Icons} src = {Account} />
                            <p style = {styles.font}>Accounts</p>
                        </Link>
                    </div>
                    <div style = {{...styles.SideNavItem, marginTop : "auto"}} onClick = {signOut} >
                        <img src = {Logout} />
                        <p style = {styles.font}>Log Out</p>
                    </div>
                </div>
                <div style = {styles.OutletWrapper} >
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Landing