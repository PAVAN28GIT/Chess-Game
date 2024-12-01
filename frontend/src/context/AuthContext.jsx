import React, { createContext, useState, useEffect } from 'react';
import BackendURL from '../utils/config.js';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast.js';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const checkUserStatus = async () => {
    try {
      const response = await fetch(`${BackendURL}/api/auth/check-auth`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log("verifying from auth context ..... : ",response);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData._id); 
        localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
        console.log("stored user in local storage");
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) {
      return;
    }

    try {
      const id = user;
      const resp = await fetch(`${BackendURL}/api/user/profile/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (resp.ok) {
        const data = await resp.json();
        setUserProfile(data);
      } else {
        showToast("Error fetching User", "error");
        navigate("/sign-in");
      }
    } catch (error) {
      // Catch any errors during the fetch
      showToast("Error fetching User", "error");
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);


  useEffect(() => {
    checkUserStatus();
  }, []); 

  useEffect(() => {
    // Check user status on mount in local storage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData._id);
      console.log("user set from local storage");
    } else {
      checkUserStatus(); // Call to verify the user's session on first load
    }
  }, []);

  useEffect(() => {
    console.log("global user context is begin set to : " , user)
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser , userProfile , setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
