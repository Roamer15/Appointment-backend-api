import { createContext, useState } from "react";

export const UserDataContext  = createContext()

export const UserData = ({children}) => {

    const [user, setUser] = useState(null)

    return (
        <UserDataContext.Provider value={{user, setUser}}>
            {children}
        </UserDataContext.Provider>
    )
}
