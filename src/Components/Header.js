import React from 'react'
import Logo from "../assets/Icons/Colour Inverse.svg"

const Header = () => {

    const styles = {
        Header : {
            backgroundColor: "var(--clr-header)",
            height : "10vh",
            display : "flex",
            alignItems : "center",
            padding : "0 2rem",
            justifyContent : "space-between",
        },
        FlexContainer : {
            display : "flex",
            alignItems : "center",
            gap : "0.2rem",
        },
        Logo : {
            width : "4rem",
            height : "4rem",
            backgroundColor : "red",
        },
        Text : {
            color : "white",
        },
        Title : {
            fontSize : "2.5rem",
        },
        Subtitle : {
            fontSize : "0.8rem",
            letterSpacing : "2px",
            marginTop : "-0.5rem"
        },
        Circle : {
            borderRadius : "50%",
        },
        Profile : {
            width : "5rem",
            height : "5rem",
            color : "white",
            cursor : "pointer",
        },
        Notification : {
            width : "2.5rem",
            height : "2.5rem",
            color : "white",
            cursor : "pointer",
        }
    }

    return (
        <nav style = {styles.Header} >
            <img src = {Logo} />
            <div style = {{...styles.FlexContainer, gap : "1.5rem"}} >
                <ion-icon style = {styles.Notification} name="notifications-outline"></ion-icon>
                <ion-icon style = {styles.Profile} name="person-circle-outline"></ion-icon>
            </div>
        </nav>
    )
}

export default Header