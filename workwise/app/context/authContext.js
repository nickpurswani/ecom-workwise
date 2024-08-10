"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      
    setUser(token);
    setLoading(false);
    setError(null);
    }
    
   
  }, []);

  const signIn = (userData) => {
    setUser(userData);
    setLoading(false);
    localStorage.setItem('jwtToken', userData);
    setError(null);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('jwtToken');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
