import react, { useState, useEffect } from 'react'

const Loading = ({text}) => {

    const [dots, setDots] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev+1)%4)
        }, 200)
        return () => clearInterval(interval)
    }, [])

    const styles ={
        Loader : {
            height : "100vh",
            display : "grid",
            placeItems : "center",
            // boxShadow : "0 0 100vh 100vh rgba(0, 0, 0, 0.2)",
        },
    }

    return (
        <div style = {styles.Loader}>
            <h1>{text}{".".repeat(dots)}</h1>
        </div>
    )
}

export default Loading