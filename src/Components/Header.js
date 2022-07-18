import React from 'react'
import Logo from "../assets/Icons/Colour Inverse.svg"
import Alarm from "../assets/Icons/Main Nav/alarm-bell Copy.svg"

const Header = () => {

    const styles = {
        Header : {
            backgroundColor: "var(--clr-header)",
            height : "10vh",
            display : "flex",
            padding : "0 2.4rem",
            alignItems : "center",
            justifyContent : "space-between",
        },
        FlexContainer : {
            display : "flex",
            alignItems : "center",
            gap : "2.5rem",
        },
        Logo : {
            width : "15.3rem",
            height : "4.8rem",
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
            width : "4.8rem",
            height : "4.8rem",
            color : "white",
            cursor : "pointer",
        },
        Notification : {
            width : "3rem",
            height : "3rem",
            filter: "invert(100%) sepia(0%) saturate(7420%) hue-rotate(316deg) brightness(123%) contrast(119%)",
            cursor : "pointer",
        }
    }

    return (
        <nav style = {styles.Header} >
            <img src = {Logo}/>
            <div style = {styles.FlexContainer} >
                <img src = {Alarm} />
                <ion-icon style = {styles.Profile} name="person-circle-outline"></ion-icon>
                {/* <ion-icon style = {styles.Notification} name="notifications-outline"></ion-icon> */}
            </div>
        </nav>
    )
}

export default Header