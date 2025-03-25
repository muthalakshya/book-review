import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {toast } from 'react-toastify';
// import { products as pd} from "../assets/data"

export const ShopContext = createContext();

const ShopContextProvider = (props)=>{

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [token,setToken] = useState('')
    const navigate = useNavigate()


    // useEffect(() => {
    //     const fetchUserContextData = async () => {
    //       try {
    //         const response = await axios.get(`${backendUrl}/api/user/user-profile`, {
    //           headers: { Authorization: `Bearer ${token}` },
    //         });
    
    //         if (response.data.success) {
    //           setUserContextData(response.data.user);
    //         //   console.log(response.data.user.email);
    //         } else {
    //           console.error(response.data.message);
    //         }
    //       } catch (error) {
    //         console.error("Error fetching user data:", error);
    //       }
    //     };
    
    //     if (token) fetchUserContextData();
    //   }, [token, backendUrl]);


    useEffect (()=>{
        if (!token && localStorage.getItem('authToken') ) {
            setToken(localStorage.getItem('authToken'))
        }
    },[])


    const value = {
        currency, delivery_fee,
        navigate,
        backendUrl,
        setToken, token
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;