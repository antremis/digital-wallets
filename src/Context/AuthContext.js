import React, {useEffect, useState, useContext, createContext} from 'react'
import Axios from '../Axios/Axios'
import Loading from '../Components/Loading'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext()

const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (email, password) => {
        setStatus("Loading User")
        setLoading(true)
        return Axios
        .post("http://127.0.0.1:5000/api/auth/login", {username : email, password})
        .then(data => {setUser(data.data.user);})
        .catch(err => {return err.response.data.message})
        .finally(() => {setLoading(false);setStatus("Loading User");})
    }

    const signOut = async (email, password) => {
        setStatus("Signing Out")
        setLoading(true)
        return Axios
        .get("http://127.0.0.1:5000/api/auth/logout")
        .then(data => {setUser(data.data.user)})
        .catch(err => {return err.response.data.message})
        .finally(() => {setLoading(false);setStatus("Loading User");})
    }

    const handleSignup = async (email, password) => {
        setStatus("Creating User")
        setLoading(true)
        return Axios
        .post("http://127.0.0.1:5000/api/auth/signup", {username : email, password})
        .then(data => {setUser(data.data.user)})
        .catch(err => {return err.response.data.message})
        .finally(() => {setLoading(false);setStatus("Loading User");})
    }
    
    const validateOTP = async (otp) => {
        return Axios
        .post("http://127.0.0.1:5000/api/auth/validateotp", {otp})
        .then(data => {console.log(data)})
        .catch(err => {return err.response.data.message})
    }
    
    const getOTP = async (email) => {
        return Axios
        .post("http://127.0.0.1:5000/api/auth/getotp", {email})
        .then(data => {console.log(data)})
        .catch(err => {return err.response.data.message})
    }
    
    useEffect(() => {
        Axios
        .get("http://127.0.0.1:5000/api/auth/getUser")
        .then(res => {setUser(res.data.user)})
        .catch(err => console.log(err))
    }, [])

    // useEffect(() => {
    //     user 
    //     ? navigate("/accounts") 
    //     : navigate("/login")
    // }, [user])

    return (
        <AuthContext.Provider value = {{user, handleLogin, signOut, handleSignup, getOTP, validateOTP}}>
            {loading ? <Loading text = {status} /> : children}
        </AuthContext.Provider> 
    )
}

export default AuthContextProvider
export const useAuthContext = () => useContext(AuthContext)