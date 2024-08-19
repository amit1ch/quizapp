import React from 'react'
import { useLocation ,Navigate,Outlet} from 'react-router-dom'
import { useAuthContext } from './AuthContext/AuthContext'

const PublicRoute = () => {
   const{user}= useAuthContext()
   const location=useLocation()
  
    if(user){
        return <Navigate to="/dashboard"  state={{from:location}} replace/>
    }
    return <Outlet/>
  
}

export default PublicRoute
