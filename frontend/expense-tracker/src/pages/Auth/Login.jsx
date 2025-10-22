import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';

const Login = () => {
    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!password) {
            setError('Please enter the password.');
            return;
        }

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                updateUser(response.data.user);
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
            {/* ✅ Card: Small on mobile (max-w-md), Medium on desktop (md:max-w-lg) */}
            <div className="w-full max-w-md md:max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Expense Tracker
                    </h1>
                    {/* ✅ Decorative divider */}
                    <div className="w-16 h-0.5 bg-primary mx-auto my-3"></div>

                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-600">
                        Please login to your account.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
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
                        LOGIN
                    </button>

                    {/* ✅ Reduced margin */}
                    <p className="text-center text-sm text-gray-600 mt-3">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/signUp')}
                            className="text-primary font-medium hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login
