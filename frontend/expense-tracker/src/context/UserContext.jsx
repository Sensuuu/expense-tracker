import React, { createContext, useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

// Create context for user authentication state management
export const UserContext = createContext();

/**
 * UserProvider - Manages user authentication state across the entire application
 * Handles token persistence, user data fetching, and authentication state
 */
const UserProvider = ({ children }) => {
    // User state - stores current authenticated user data
    const [user, setUser] = useState(null);

    // Loading state - tracks authentication initialization status
    const [loading, setLoading] = useState(true);

    /**
     * Initialize user authentication on app startup
     * Checks for existing token and fetches user data if valid
     */
    useEffect(() => {
        const initializeUser = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // Fetch user data with existing token
                    const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                    setUser(response.data);
                } catch (error) {
                    // Invalid token - remove from storage
                    localStorage.removeItem('token');
                    console.error('Authentication failed:', error.message);
                }
            }

            // Authentication check complete
            setLoading(false);
        };

        initializeUser();
    }, []);

    /**
     * Update user data in context
     * @param {Object} userData - User object from login/registration
     */
    const updateUser = (userData) => {
        setUser(userData);
    };

    /**
     * Clear user session and logout
     * Removes user data and token from state and storage
     */
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    // Provide authentication state and methods to children components
    return (
        <UserContext.Provider
            value={{
                user,           // Current authenticated user data
                updateUser,     // Function to set user data
                clearUser,      // Function to logout user
                loading,        // Authentication initialization status
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
