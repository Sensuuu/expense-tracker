import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({ children, activeMenu }) => {
    // Get authentication state from context
    const { user, loading } = useContext(UserContext);

    // Show loading spinner while authentication is being verified
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // Redirect to login if user is not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Render protected dashboard layout
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top navigation bar */}
            <Navbar activeMenu={activeMenu} />

            {/* Main layout with sidebar and content */}
            <div className="flex">
                {/* Sidebar - hidden on small screens */}
                <div className="max-[1080px]:hidden">
                    <SideMenu activeMenu={activeMenu} />
                </div>

                {/* Main content area */}
                <div className="grow mx-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
