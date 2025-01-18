import React, { createContext, useState } from 'react'
export const AuthContext=createContext();
const AuthContextProvider = ({children}) => {
   

    const [isAuth, setIsAuth] = useState(() => {
      const user = localStorage.getItem('user'); // Check if user exists in localStorage
      return user && JSON.parse(user).token ? true : false; // Return true if token is present
    });
    const login=()=>{
        setIsAuth(true)
    }

    const logOut=()=>{
        setIsAuth(false)
    }
  return (
    <AuthContext.Provider  value={{isAuth,login,logOut}} >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
