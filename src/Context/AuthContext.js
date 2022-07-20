import React, {useEffect, useState, useContext, createContext} from 'react'
import Axios from '../Axios/Axios'
import Loading from '../Components/Loading'
import { useNavigate } from 'react-router-dom';
import BaseUri from "./BaseUri"

const AuthContext = createContext()

const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
    const navigate = useNavigate()

    const changeUser = async (username) => {
        setStatus("Getting ETH Balance")
        setLoading(true)
        const response = await Axios.post(`${BaseUri}/api/admin/changeacc`, {username})
        setUser(response.data.user)
        setAdmin(response.data.user)
        setStatus("")
        setLoading(false)
    }

    const handleLogin = async (email, password) => {
        setStatus("Loading User")
        setLoading(true)
        return Axios
        .post(`${BaseUri}/api/auth/login`, {username : email, password})
        .then(data => {setUser(data.data.user);setAdmin(data.data.admin)})
        .catch(err => {window.alert(err.response.data.message)})
        .finally(() => {setLoading(false);setStatus("Loading User");})
    }

    const signOut = async (email, password) => {
        setStatus("Signing Out")
        setLoading(true)
        return Axios
        .get(`${BaseUri}/api/auth/logout`)
        .then(data => {setUser(data.data.user)})
        .catch(err => {return err.response.data.message})
        .finally(() => {setLoading(false);setStatus("Loading User");})
    }

    const handleSignup = async (email, password, recoveryPassword) => {
        setStatus("Creating User")
        setLoading(true)
        return Axios
        .post(`${BaseUri}/api/auth/signup`, {username : email, password, recoveryPassword})
        .then(data => {setUser(data.data.user)})
        .catch(err => {return err.response.data.message})
        .finally(() => {setLoading(false);setStatus("Loading User");})
    }
    
    const validateOTP = async (otp) => {
        return Axios
        .post(`${BaseUri}/api/auth/validate`, {otp})
        .then(data => {console.log(data)})
        .catch(err => {return err.response.data.message})
    }
    
    const getOTP = async (email) => {
        return Axios
        .post(`${BaseUri}/api/auth/getotp`, {email})
        .then(data => {console.log(data)})
        .catch(err => {return err.response.data.message})
    }
    
    const resetPassword = async (password) => {
        return Axios
        .post(`${BaseUri}/api/auth/reset`, {password})
        .then(data => {console.log(data)})
        .catch(err => {return err.response.data.message})
    }
    
    useEffect(() => {
        Axios
        .get(`${BaseUri}/api/auth/getUser`)
        .then(res => {setUser(res.data.user);setAdmin(res.data.admin)})
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        user 
        ? navigate("/accounts") 
        : navigate("/login")
    }, [user])

    return (
        <AuthContext.Provider value = {{user, admin, changeUser, handleLogin, signOut, handleSignup, getOTP, validateOTP, resetPassword}}>
            {loading ? <Loading text = {status} /> : children}
        </AuthContext.Provider> 
    )
}

export default AuthContextProvider
export const useAuthContext = () => useContext(AuthContext)