import React from 'react'
import { useAuthContext } from './AuthContext/AuthContext'
import { Outlet,Navigate,useLocation } from 'react-router-dom';
const ProtectedRoute = () => {
    const location = useLocation();

   const {user} =  useAuthContext();
  
    
       if (!user) {

          return <Navigate to="/Login" state={{ from: location}} replace />;
     }


  return <Outlet />;
    
    
  
}

export default ProtectedRoute
