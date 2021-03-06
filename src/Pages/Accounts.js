import React, {useState} from'react'
import { Outlet, Link } from 'react-router-dom';
import Bitcoin from "../assets/Icons/Currencies/Bitcoin.svg";
import Ethereum from "../assets/Icons/Currencies/Ethereum.svg";
import Ripple from "../assets/Icons/Currencies/Ripple.svg";
import NonFungibleToken from "../assets/Icons/Currencies/NFT.svg";
import Tokens from "../assets/Icons/Currencies/Tokens.svg";
import Cash from "../assets/Icons/Currencies/cash-outline.svg";


const Accounts = () => {

    const [FIAT, setFIAT] = useState({transform : "translateY(500%) scaleX(0)", opacity : "0"});
    const [BTC, setBTC] = useState({transform : "translateY(500%) scaleX(0)", opacity : "0"});
    const [ETH, setETH] = useState({transform : "translateY(500%) scaleX(0)", opacity : "0"});
    const [XRP, setXRP] = useState({transform : "translateY(500%) scaleX(2)", opacity : "1"});
    const [NFT, setNFT] = useState({transform : "translateY(500%) scaleX(0)", opacity : "0"});
    const [TOK, setTOK] = useState({transform : "translateY(500%) scaleX(0)", opacity : "0"});

    const styles = {
        FlexContainer : {
            display : "flex",
            width : "100%",
            height : "100%",
            flexDirection : "column",
            alignItems : "center",
            padding : "0 3rem",
        },
        InvestmentWrapper : {
            display : "flex",
            alignItems : "flex-end",
            textAlign : "center",
            gap : "5rem",
            fontSize : "0.8rem",
            padding : "1rem 0"
        },
        CurrencyName : {
            fontSize : "1.8rem",
        },
        IconWrapper : {
            cursor : "pointer",
        },
        Icon : {
            width : "3rem",
            height : "3rem",
            marginBottom : "0.5rem"
        },
        Underline : {
            height : "0.2rem",
            width : "100%",
            backgroundColor : "var(--clr-icon-highlight)",
            display : "block",
            borderRadius : "100vw",
            transitionDuration : "0.2s",
            transform : "translateY(150%) scaleX(2)",
            marginTop : "0.5rem",
        },
        TableWrapper : {
            width : "100%",
            height : "100%",
        },
        HR : {
            width : "100%",
            height : "0.1rem",
            backgroundColor : "var(--clr-white-border)",
            marginTop : "-0.2rem",
        },
    }

    const HandleIconClick = (icon) => {

        setFIAT({transform : "translateY(500%) scaleX(0)", opacity : "0"});
        setBTC({transform : "translateY(500%) scaleX(0)", opacity : "0"});
        setETH({transform : "translateY(500%) scaleX(0)", opacity : "0"});
        setXRP({transform : "translateY(500%) scaleX(0)", opacity : "0"});
        setNFT({transform : "translateY(500%) scaleX(0)", opacity : "0"});
        setTOK({transform : "translateY(500%) scaleX(0)", opacity : "0"});

        switch(icon){
            case "FIAT": setFIAT({transform : "translateY(500%) scaleX(2)", opacity : "1"}); break;
            case "BTC": setBTC({transform : "translateY(500%) scaleX(2)", opacity : "1"}); break;
            case "ETH": setETH({transform : "translateY(500%) scaleX(2)", opacity : "1"}); break;
            case "XRP": setXRP({transform : "translateY(500%) scaleX(2)", opacity : "1"}); break;
            case "NFT": setNFT({transform : "translateY(500%) scaleX(2)", opacity : "1"}); break;
            case "TOK": setTOK({transform : "translateY(500%) scaleX(2)", opacity : "1"}); break;
            default: break;
        }
    }

    return(
        <div style = {styles.FlexContainer} >
            <div style = {styles.InvestmentWrapper} >
                {/* <Link to = "/accounts/FIAT" style = {styles.IconWrapper} onClick = {() => {HandleIconClick("FIAT")}} >
                    <img src = {Cash} style = {styles.Icon} alt = "Fiat" />
                    <p style = {styles.CurrencyName}>Fiat</p>
                    <span style = {{...styles.Underline, ...FIAT}}></span>
                </Link> */}
                <Link to = "/accounts/BTC" style = {styles.IconWrapper} onClick = {() => {HandleIconClick("BTC")}} >
                    <img src = {Bitcoin} style = {styles.Icon} alt = "Bitcoin" />
                    <p style = {styles.CurrencyName}>Bitcoin</p>
                    <span style = {{...styles.Underline, ...BTC}}></span>
                </Link>
                <Link to = "/accounts/XRP" style = {styles.IconWrapper} onClick = {() => {HandleIconClick("XRP")}} >
                    <img src = {Ripple} style = {styles.Icon} alt = "Ripple" />
                    <p style = {styles.CurrencyName}>Ripple</p>
                    <span style = {{...styles.Underline, ...XRP}}></span>
                </Link>
                <Link to = "/accounts/ETH" style = {styles.IconWrapper} onClick = {() => {HandleIconClick("ETH")}} >
                    <img src = {Ethereum} style = {styles.Icon} alt = "Ethereum" />
                    <p style = {styles.CurrencyName}>Ethereum</p>
                    <span style = {{...styles.Underline, ...ETH}}></span>
                </Link>
                <Link to = "/accounts/NFT" style = {styles.IconWrapper} onClick = {() => {HandleIconClick("NFT")}} >
                    <img src = {NonFungibleToken} style = {styles.Icon} alt = "NFT" />
                    <p style = {styles.CurrencyName}>NFT</p>
                    <span style = {{...styles.Underline, ...NFT}}></span>
                </Link>
                <Link to = "/accounts/TOK" style = {styles.IconWrapper} onClick = {() => {HandleIconClick("TOK")}} >
                    <img src = {Tokens} style = {styles.Icon} alt = "Tokens" />
                    <p style = {styles.CurrencyName}>Token</p>
                    <span style = {{...styles.Underline, ...TOK}}></span>
                </Link>
            </div>
            <hr style = {styles.HR} ></hr>
            <div style = {styles.TableWrapper} >
                <Outlet />
            </div>
        </div>
    )
}

export default Accounts