import React, {useState} from'react'
import { Link, Outlet } from 'react-router-dom';
import Header from '../Components/Header'
import { useAuthContext } from '../Context/AuthContext';
import Account from "../assets/Icons/Main Nav/account.svg";
import Wallet from "../assets/Icons/Main Nav/wallet.svg";
// import {ReactComponent as Wallet} from "../assets/Icons/Main Nav/wallet.svg";
import Logout from "../assets/Icons/Main Nav/logout.svg";

const Landing = () => {

    const [wallet, setWallet] = useState({filter : "none"});
    const [account, setAccount] = useState({filter: "invert(29%) sepia(55%) saturate(2436%) hue-rotate(180deg) brightness(91%) contrast(98%)"});
    const {signOut} = useAuthContext();

    const styles = {
        FlexContainer : {
            display : "flex",
            width : "100%",
        },
        SideNav : {
            width : "5vw",
            backgroundColor : "var(--clr-white-dark)",
            height : "90vh",
            flexDirection : "column",
            alignItems : "center",
            padding : "2rem 0"
        },
        SideNavItem : {
            fontSize : "0.9rem",
            display : "flex",
            flexDirection : "column",
            justifyContent : "center",
            alignItems : "center",
            cursor : "pointer",
    	    transitionDuration : "0.2s",
        },
        IonicIcons : {
            width : "3em",
            height : "3em",
        },
        OutletWrapper : {
            width : "100%",
            padding : "1rem 3rem",
        },
    }

    const handleIconClick = (icon) => {
        setWallet({filter : "none"});
        setAccount({filter : "none"});
        if(icon === "wallet") {
            setWallet({filter: "invert(29%) sepia(55%) saturate(2436%) hue-rotate(180deg) brightness(91%) contrast(98%)"});
        }
        if(icon === "account") {
            setAccount({filter: "invert(29%) sepia(55%) saturate(2436%) hue-rotate(180deg) brightness(91%) contrast(98%)"});
        }
    }

    return(
        <>
            <Header />
            <div style = {styles.FlexContainer} >
                <div style = {{...styles.FlexContainer, ...styles.SideNav}}>
                    <div style = {{marginTop : "auto"}}>
                        <Link style = {{...styles.SideNavItem, ...wallet, marginBottom : "3rem"}} to = "/wallet" onClick = {() => {handleIconClick("wallet")}} >
                            <img src = {Wallet} />
                            {/* {<Wallet />} */}
                            <p>Wallets</p>
                        </Link>
                        <Link style = {{...styles.SideNavItem, ...account}} to = "/accounts" onClick = {() => {handleIconClick("account")}} >
                            <img src = {Account} />
                            <p>Accounts</p>
                        </Link>
                    </div>
                    <div style = {{...styles.SideNavItem, marginTop : "auto"}} onClick = {signOut} >
                        <img src = {Logout} />
                        <p>Log Out</p>
                    </div>
                </div>
                <div style = {styles.OutletWrapper} >
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Landing