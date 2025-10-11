import React, { useContext, useState } from 'react';
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from '../../context/UserContext';
import { useNavigate } from "react-router-dom";
import CharAvtar from '../cards/CharAvtar';
import Modal from '../Modal';
import LogoutAlert from '../LogoutAlert';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleClick = (route) => {
        if (route === "logout") {
            setShowLogoutModal(true);
            return;
        }
        navigate(route);
    };

    const handleLogoutConfirm = () => {
        // localStorage.clear();
        clearUser();
        setShowLogoutModal(false);
        navigate("/login");
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
                <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                    {user?.profileImageUrl ? (
                        <img
                            src={(() => {
                                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
                                const profileUrl = user.profileImageUrl;

                                // Debug logs (remove after fixing)
                                console.log("API URL:", apiUrl);
                                console.log("Profile URL from backend:", profileUrl);

                                // If URL already has http/https, use as-is
                                if (profileUrl?.startsWith('http')) {
                                    console.log("Using full URL:", profileUrl);
                                    return profileUrl;
                                }

                                // Otherwise prepend backend URL
                                const fullUrl = `${apiUrl}${profileUrl}`;
                                console.log("Constructed URL:", fullUrl);
                                return fullUrl;
                            })()}
                            alt="Profile Image"
                            className="w-20 h-20 bg-slate-400 rounded-full " />
                    ) : (<CharAvtar
                        fullName={user?.fullName}
                        width="w-20"
                        height="h-20"
                        style="text-xl" />
                    )}

                    <h5 className="text-gray-950 font-medium leading-6">
                        {user?.fullName || ""}
                    </h5>
                </div>

                {SIDE_MENU_DATA.map((item, index) => {
                    return (
                        <button
                            key={`menu_${index}`}
                            className={`w-full flex items-center gap-4 text-[15px] ${activeMenu === item.label ? "text-white bg-primary" : "text-gray-700 hover:bg-gray-50"} py-3 px-6 rounded-lg mb-3`}
                            onClick={() => handleClick(item.path)}
                        >
                            <item.icon className="text-xl" />
                            {item.label}
                        </button>
                    )
                })}
            </div>

            {/**Logout Confirmation Modal */}

            <Modal
                isOpen={showLogoutModal}
                onClose={handleLogoutCancel}
                title="Confirm Logout"
            >
                <LogoutAlert
                    onConfirm={handleLogoutConfirm}
                    onCancel={handleLogoutCancel}
                />
            </Modal>
        </>
    )
}

export default SideMenu;