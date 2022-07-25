import react, { useState, useEffect } from 'react'

const Notification = ({status, img}) => {

    const styles ={
        Notification : {
            position : "absolute",
            display : "flex",
            flexDirection : "column",
            alignItems : "center",
            justifyContent : "center",
            gap : "1.5rem",
            top : "50%",
            left : "52%",
            width : "80ch",
            height : "40ch",
            transform : "translate(-50%, -50%)",
            color : "var(--clr-black)",
            backgroundColor : "var(--clr-white)",
            boxShadow : "0 0 100vw 100vw rgba(0, 0, 0, 0.7)",
            zIndex : "100",
            borderRadius : "0.5rem",
        },
        IMG : {
            width : "5rem",
            height : "5rem",
        }
    }

    return (
        <>
            {
                status
                ? (
                    <div style = {styles.Notification}>
                        {
                            img
                            ?   <img style = {styles.IMG} src = {img} alt = "Notification" />
                            :   null
                        }
                        {/* {
                            err
                            ? <img src = {Fail} alt = "Fail" style = {styles.IMG} />
                            : <img src = {Success} alt = "Success" style = {styles.IMG} />
                        } */}
                        <h1>{status}</h1>
                    </div>
                )
                : null
            }
        </>
    )
}

export default Notification