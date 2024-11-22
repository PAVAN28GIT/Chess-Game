import React, { createContext, useState, useEffect } from 'react';
import BackendURL from '../utils/config.js';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch(`${BackendURL}/api/auth/check-auth`, {
          method: 'GET',
          credentials: 'include',
        });
        console.log("verifying from auth context ..... : ",response);
        if (response.ok) {
          const userData = await response.json();
          console.log("fetch was made to check-auth : ", userData._id);
          setUser(userData._id); 
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkUserStatus();
  }, []); 


  useEffect(() => {
    console.log("global user context is begin changed... " , user)
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser , userProfile , setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
