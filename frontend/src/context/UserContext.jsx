import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../utils/api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: "",
        location: "",
        profilePic: null,
        isLoggedIn: false,
        userType: "user",
        businessName: "",
        bio: "",
        serviceAreas: [],
        experience: 0,
        verified: false
    });
    const [loading, setLoading] = useState(true);

    // Load user from backend on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authAPI.getCurrentUser();
                    // Normalize location - handle both object and string formats
                    const location = response.user.location;
                    const normalizedLocation = typeof location === 'string' 
                        ? location 
                        : (location?.address || location?.city || '');
                    
                    setUser({
                        ...response.user,
                        location: normalizedLocation,
                        isLoggedIn: true
                    });
                } catch (error) {
                    // Don't block the app if API call fails
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('token');
                }
            }
            // Always set loading to false, even if there's an error
            setLoading(false);
        };
        loadUser();
    }, []);

    // Save to local storage whenever user changes
    useEffect(() => {
        if (user.isLoggedIn) {
            localStorage.setItem('serviceProUser', JSON.stringify(user));
        }
    }, [user]);

    const updateProfile = async (updates) => {
        try {
            // Update in backend
            const token = localStorage.getItem('token');
            if (token) {
                const response = await userAPI.updateProfile(updates);
                // Update local state with full user data from response
                if (response && response.user) {
                    // Normalize location - handle both object and string formats
                    const location = response.user.location;
                    const normalizedLocation = typeof location === 'string' 
                        ? location 
                        : (location?.address || location?.city || '');
                    
                    setUser(prev => ({
                        ...prev,
                        ...response.user,
                        location: normalizedLocation,
                        isLoggedIn: true
                    }));
                } else {
                    // Fallback: update with provided updates
                    setUser(prev => ({ ...prev, ...updates }));
                }
            } else {
                // Update local state only
                setUser(prev => ({ ...prev, ...updates }));
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            // Still update local state for immediate UI feedback
            setUser(prev => ({ ...prev, ...updates }));
        }
    };

    const updateLocation = async (locationData) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await userAPI.updateLocation(locationData);
                setUser(prev => ({
                    ...prev,
                    location: locationData.address || locationData.city || locationData
                }));
            }
        } catch (error) {
            console.error('Failed to update location:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser({
            name: "",
            location: "",
            profilePic: null,
            isLoggedIn: false,
            userType: "user",
            businessName: "",
            bio: "",
            serviceAreas: [],
            experience: 0,
            verified: false
        });
    };

    // Don't block rendering while loading
    return (
        <UserContext.Provider value={{ user, updateProfile, updateLocation, logout, loading }}>
            {loading ? (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh',
                    fontFamily: 'Poppins, sans-serif'
                }}>
                    <div>Loading...</div>
                </div>
            ) : (
                children
            )}
        </UserContext.Provider>
    );
};
