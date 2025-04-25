// src/hooks/useAuth.js
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  console.log(token)
  }, []);
useEffect(()=>{
console.log(isAuthenticated)
},[isAuthenticated])

  return {
    isAuthenticated,
    setIsAuthenticated
  };
};

export default useAuth;
