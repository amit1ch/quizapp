 import React,{useState,createContext, useContext, useEffect} from 'react'

 export const Context = createContext();
 
 const AuthContext = ({children}) => {

  const [user,setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Load user from localStorage if available
    }
  }, [setUser]);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };





   return (
      <Context.Provider value={{user,login,logout}}>
        {children}
      </Context.Provider>
   )
 }

 const useAuthContext =()=>{
   return useContext(Context);
 }

 
 export { AuthContext, useAuthContext}
 
