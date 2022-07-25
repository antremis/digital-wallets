import React, {useEffect, useState, useContext, createContext} from 'react'
import Axios from '../Axios/Axios'
import { useNavigate } from 'react-router-dom';
import BaseUri from "./BaseUri"
import Notification from '../Components/Notification';

const AuthContext = createContext()

const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(false)
    const [status, setStatus] = useState("")
    const navigate = useNavigate()

    const changeUser = async (username) => {
        setStatus("Getting ETH Balance")
        const response = await Axios.post(`${BaseUri}/api/admin/changeacc`, {username})
        setUser(response.data.user)
        setAdmin(response.data.user)
        setStatus("")
    }

    const handleLogin = async (email, password) => {
        setStatus("Loading User")
        return Axios
        .post(`${BaseUri}/api/auth/login`, {username : email, password})
        .then(data => {setUser(data.data.user);setAdmin(data.data.admin);setTimeout(() => {setStatus("")}, 1000)})
        .catch(err => {setStatus(err.response.data.message); setTimeout(() => {setStatus("")}, 1000)})
    }

    const signOut = async (email, password) => {
        setStatus("Signing Out")
        return Axios
        .get(`${BaseUri}/api/auth/logout`)
        .then(data => {setUser(data.data.user);setTimeout(() => {setStatus("")}, 1000)})
        .catch(err => {setStatus(err.response.data.message); setTimeout(() => {setStatus("")}, 1000)})
    }

    const handleSignup = async (email, password, recoveryPassword) => {
        setStatus("Creating User")
        return Axios
        .post(`${BaseUri}/api/auth/signup`, {username : email, password, recoveryPassword})
        .then(data => {setTimeout(() => {setStatus("")}, 1000)})
        .catch(err => {setStatus(err.response.data.message); setTimeout(() => {setStatus("")}, 1000)})
    }
    
    const validateOTP = async (otp) => {
        return Axios
        .post(`${BaseUri}/api/auth/validate`, {otp})
        .then(data => {console.log(data);setTimeout(() => {setStatus("")}, 1000)})
        .catch(err => {setStatus(err.response.data.message); setTimeout(() => {setStatus("")}, 1000)})
    }
    
    const getOTP = async (email) => {
        return Axios
        .post(`${BaseUri}/api/auth/getotp`, {email})
        .then(data => {console.log(data);setTimeout(() => {setStatus("")}, 1000)})
        .catch(err => {setStatus(err.response.data.message); setTimeout(() => {setStatus("")}, 1000)})
    }
    
    const resetPassword = async (password) => {
        return Axios
        .post(`${BaseUri}/api/auth/reset`, {password})
        .then(data => {console.log(data);setTimeout(() => {setStatus("")}, 1000)})
        .catch(err => {setStatus(err.response.data.message); setTimeout(() => {setStatus("")}, 1000)})
    }
    
    useEffect(() => {
        Axios
        .get(`${BaseUri}/api/auth/getUser`)
        .then(res => {setUser(res.data.user);setAdmin(res.data.admin);setTimeout(() => {setStatus("")}, 1000)})
        .catch(err => {setStatus("Server Unavailable"); setTimeout(() => {setStatus("")}, 1000)})
    }, [])

    useEffect(() => {
        user 
        ? navigate("/accounts") 
        : navigate("/login")
    }, [user])

    return (
        <AuthContext.Provider value = {{user, admin, changeUser, handleLogin, signOut, handleSignup, getOTP, validateOTP, resetPassword}}>
            {<Notification status = {status} />}
            {children}
        </AuthContext.Provider> 
    )
}

export default AuthContextProvider
export const useAuthContext = () => useContext(AuthContext)