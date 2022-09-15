import { createContext, useContext, useEffect, useState} from "react";
import { Auth } from "aws-amplify";
import { DataStore } from "aws-amplify";
import { Courier } from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {

    const [authUser, setAuthUser] = useState(null);
    const [dbCourier, setDbCourier] = useState(null);
    
    const sub = authUser?.attributes?.sub;

    useEffect(() =>{
        DataStore.query(Courier, (courier) => courier.sub('eq', sub)).then(
            (couriers)=> setDbCourier(couriers[0])
        )
    }, [sub]);

    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser);
    },[]);

    return(
        <AuthContext.Provider value={{authUser, dbCourier, sub, setDbCourier}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);