import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Input from '../../components/inputs/Input';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import uploadImage from '../../utils/uploadImage';
import { validateEmail } from '../../utils/helper';

const SignUp = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState(null);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName) {
            setError('Please enter your name.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!password) {
            setError('Please enter the password.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        try {
            let profileImageUrl = '';

            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || '';
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl,
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* ✅ Card: Small on mobile (max-w-md), Large on desktop (md:max-w-2xl) */}
            <div className="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Expense Tracker
                    </h1>
                    {/* ✅ FIXED: Added border between titles */}
                    <div className="w-16 h-0.5 bg-primary mx-auto my-3"></div>

                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                        Create An Account
                    </h2>
                    <p className="text-sm text-gray-600">
                        Join us today by entering your details below.
                    </p>
                </div>

                {/* Profile Photo Selector */}
                <div className="flex justify-center mb-5">
                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                </div>

                {/* Form */}
                <form onSubmit={handleSignUp} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ✅ Desktop: Side by side, Mobile: Stacked */}
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Min 8 Characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        SIGN UP
                    </button>

                    {/* ✅ FIXED: Reduced margin to prevent scrolling on mobile */}
                    <p className="text-center text-sm text-gray-600 mt-3">
                        Already Have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-primary font-medium hover:underline"
                        >
                            Login
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp
