import React, { useContext, useState } from 'react';
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from '../../context/UserContext';
import { useNavigate } from "react-router-dom";
import CharAvtar from '../cards/CharAvtar';
import Modal from '../Modal';
import LogoutAlert from '../LogoutAlert';
import ProfileUpdateForm from '../ProfileUpdateForm';
import { LuUser } from 'react-icons/lu'; // ✅ Import icon
import ProfileModal from '../ProfileModal'


const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleClick = (route) => {
        if (route === "logout") {
            setShowLogoutModal(true);
            return;
        }
        if (route === "/profile") {
            setShowProfileModal(true);
            return;
        }
        navigate(route);
    };

    const handleLogoutConfirm = () => {
        clearUser();
        setShowLogoutModal(false);
        navigate("/login");
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-10">
                <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                    {/* ✅ Updated Image Display Logic */}
                    {user?.profileImageUrl ? (
                        <img
                            src={(() => {
                                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
                                const profileUrl = user.profileImageUrl;

                                if (profileUrl?.startsWith('http')) {
                                    return profileUrl;
                                }

                                return `${apiUrl}${profileUrl}`;
                            })()}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        // ✅ Show LuUser icon instead of CharAvtar when no image
                        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full">
                            <LuUser className="text-4xl text-primary" />
                        </div>
                    )}

                    <h5 className="text-gray-950 font-medium leading-6">
                        {user?.fullName || ""}
                    </h5>
                </div>

                {SIDE_MENU_DATA.map((item, index) => {
                    return (
                        <button
                            key={`menu_${index}`}
                            className={`w-full flex items-center gap-4 text-[15px] ${activeMenu === item.label
                                ? "text-white bg-primary"
                                : "text-gray-700 hover:bg-gray-50"
                                } py-3 px-6 rounded-lg mb-3`}
                            onClick={() => handleClick(item.path)}
                        >
                            <item.icon className="text-xl" />
                            {item.label}
                        </button>
                    );
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

            {/**Profile Update Modal */}
            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                title="Profile Settings"
            >
                <ProfileUpdateForm onClose={() => setShowProfileModal(false)} />
            </ProfileModal>

        </>
    );
};

export default SideMenu;
