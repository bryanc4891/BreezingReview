import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserAttributes } from '@aws-amplify/auth';


const UserContext = createContext(null);

export const UserProfileProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {

        const loadUserProfile = async () => {
            try {
                const userData = await fetchUserAttributes();
                setUserProfile(userData);
            } catch (error) {
                console.error("Error loading the user: ", error);
                setUserProfile(null);
            }
        };

        loadUserProfile();
    }, []);

    return (
        <UserContext.Provider value={userProfile}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook to use the user context
export const useUserProfile = () => useContext(UserContext);
