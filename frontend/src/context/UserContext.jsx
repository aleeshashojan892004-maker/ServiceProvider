import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: "Chinnu",
        location: "HSR Layout, Bangalore",
        profilePic: null, // Could be a URL or data URI in future
        isLoggedIn: true
    });

    // Load from local storage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('serviceProUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    // Save to local storage whenever user changes
    useEffect(() => {
        localStorage.setItem('serviceProUser', JSON.stringify(user));
    }, [user]);

    const updateProfile = (updates) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    const logout = () => {
        setUser(prev => ({ ...prev, isLoggedIn: false }));
        // In a real app, clear tokens, etc.
    };

    return (
        <UserContext.Provider value={{ user, updateProfile, logout }}>
            {children}
        </UserContext.Provider>
    );
};
