import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const useAuth = () => {
    const jwtToken = useSelector(state => state.user.jwt);
    const localStorageToken = JSON.parse(localStorage.getItem('user'));

    if(jwtToken === null && localStorageToken !== null) {
        return true
    }
    
    if (jwtToken && localStorageToken) {
        return true
    }
    
    if (jwtToken === null && localStorageToken === null) {
        return false
    }

    return false
}

export const ProtectedAuthRoutes = () => {
    const isAuth = useAuth();

    return isAuth ? <Navigate to='/books/all' /> : <Outlet/> 
}
