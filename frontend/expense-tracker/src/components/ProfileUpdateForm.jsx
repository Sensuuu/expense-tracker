import React, { useState, useContext, useRef, useEffect } from 'react';
import Input from './inputs/Input';
import ProfilePhotoSelector from './inputs/ProfilePhotoSelector';
import { UserContext } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import uploadImage from '../utils/uploadImage';
import { API_PATHS } from '../utils/apiPaths';
import { validateEmail } from '../utils/helper';
import toast from 'react-hot-toast';

const ProfileUpdateForm = ({ onClose }) => {
    const { user, updateUser } = useContext(UserContext);

    const formRef = useRef(null)

    const [profilePic, setProfilePic] = useState(null);
    const [imageDeleted, setImageDeleted] = useState(false); // Track if image was deleted
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState(null);
    // const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle Update Profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        // setSuccess('');

        if (!fullName) {
            setError('Please enter your name.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (newPassword || confirmPassword || currentPassword) {
            if (!currentPassword) {
                setError('Please enter your current password to change it.');
                return;
            }
            if (newPassword.length < 8) {
                setError('New password must be at least 8 characters.');
                return;
            }
            if (newPassword !== confirmPassword) {
                setError('New passwords do not match.');
                return;
            }
        }

        setLoading(true);

        try {
            let profileImageUrl = user?.profileImageUrl || '';

            // ✅ Handle image deletion
            if (imageDeleted) {
                profileImageUrl = ''; // Send empty string to remove image
            }
            // ✅ Handle new image upload
            else if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || '';
            }

            const updateData = {
                fullName,
                email,
                profileImageUrl,
            };

            if (currentPassword && newPassword) {
                updateData.currentPassword = currentPassword;
                updateData.newPassword = newPassword;
            }

            const response = await axiosInstance.put(
                API_PATHS.AUTH.UPDATE_PROFILE,
                updateData
            );

            updateUser(response.data.user);
            toast.success('Profile updated successfully');

            // Reset states
            setProfilePic(null);
            setImageDeleted(false);

            onClose();

        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle image deletion
    const handleImageDelete = () => {
        setProfilePic(null);
        setImageDeleted(true);
    };

    // Auto focus when the component mounts
    useEffect(() => {
        if (formRef.current) {
            formRef.current.focus();
        }
    }, [])

    // Handle Enter key press
    const handlekeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUpdateProfile(e);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose()
        }
    }

    return (
        <form
            ref={formRef}
            onSubmit={handleUpdateProfile}
            className="space-y-3"
            onKeyDown={handlekeyDown}
            tabIndex="-1"
            style={{ outline: 'none' }}
        >
            {/* Profile Picture */}
            <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
                onDelete={handleImageDelete} //  Pass delete handler
                imageDeleted={imageDeleted} //  Pass deleted state
            />

            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    value={fullName}
                    onChange={({ target }) => setFullName(target.value)}
                    label="Full Name"
                    placeholder="John Doe"
                    type="text"
                />

                {/* Email */}
                <Input
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    label="Email Address"
                    placeholder="john@example.com"
                    type="email"
                />
            </div>

            {/* Password Section */}
            <div className="border-t pt-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Change Password (Optional)
                </h4>

                {/* Current Password - full width */}
                <Input
                    value={currentPassword}
                    onChange={({ target }) => setCurrentPassword(target.value)}
                    label="Current Password"
                    placeholder="Enter current password"
                    type="password"
                />

                {/* New Password & Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">

                    <Input
                        value={newPassword}
                        onChange={({ target }) => setNewPassword(target.value)}
                        label="New Password"
                        placeholder="Min 8 characters"
                        type="password"
                    />

                    <Input
                        value={confirmPassword}
                        onChange={({ target }) => setConfirmPassword(target.value)}
                        label="Confirm New Password"
                        placeholder="Re-enter new password"
                        type="password"
                    />
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium whitespace-nowrap
                        ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary/90'
                        }`}
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </div>
        </form>
    );
};

export default ProfileUpdateForm;
