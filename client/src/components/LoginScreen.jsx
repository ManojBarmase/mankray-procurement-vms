// client/src/components/LoginScreen.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Check, Loader2, Eye, EyeOff } from 'lucide-react'; // Icons
import logo1 from '../assets/logo.png';
import { API_BASE_URL } from '../config/api';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [coldStartNotice, setColdStartNotice] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setColdStartNotice(false);

        // Detect potential cold-start if free-tier server takes >3.5 seconds
        const timer = setTimeout(() => {
            setColdStartNotice(true);
        }, 3500);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
                email, 
                password 
            });
            
            clearTimeout(timer);
            setColdStartNotice(false);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            // MongoDB mein ID '_id' hoti hai, isliye hum '_id' save karenge
            localStorage.setItem('userId', response.data.user._id || response.data.user.id);

            // Compute & save initials for avatar display
            const userObj = response.data.user || {};
            const initials = `${(userObj.firstName || '')[0] || ''}${(userObj.lastName || '')[0] || ''}`.toUpperCase() || 'U';
            localStorage.setItem('userNameInitial', initials);

            setMessage('✅ Login Successful! Redirecting...');
            
            setTimeout(() => {
                const userRole = localStorage.getItem('userRole');
                if (userRole === 'admin' || userRole === 'approver') {
                    navigate('/approvals');
                } else {
                    navigate('/requests');
                }
            }, 1200);

        } catch (error) {
            clearTimeout(timer);
            setColdStartNotice(false);
            console.error("Login Error:", error.response ? error.response.data : error.message);
            
            if (error.response) {
                setMessage(error.response.data?.msg || 'Login failed. Check credentials.');
            } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
                setMessage('Network Error: Unable to reach server. Please ensure backend is awake and CORS allows this domain.');
            } else {
                setMessage(error.message || 'An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-sky-200">

            {/* Login Card Container */}
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
                
                {/* Header (Logo and Description) */}
                <div className="text-center space-y-3">
                    <div className="flex px-0 py-1 flex-col items-center justify-center">
                        <img 
                            src={logo1} 
                            alt="Mankray Logo" 
                            className="h-16 w-auto mb-2 object-contain"
                        />
                    </div>
                    <p className="text-sm text-gray-600 pt-2">
                        Sign in to your Mankray account
                    </p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-3 text-center rounded-lg text-sm ${message.includes('Successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.includes('Successful') && <Check className="inline h-4 w-4 mr-1" />} {message}
                    </div>
                )}

                {/* Cold Start Notice (Render Free Tier) */}
                {coldStartNotice && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg text-center animate-pulse">
                        Waking up backend server... Render free tier instances take ~30-50s on initial spin up. Please wait!
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    
                    {/* Email Field */}
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:text-sky-600 transition-colors cursor-pointer"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <div className="text-right">
                            <a href="#" className="text-xs text-sky-600 hover:text-sky-800">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button 
                        type="submit" 
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-sky-600 text-white hover:bg-sky-700 font-semibold shadow-sm"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Signing In...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>

                {/* Signup Link */}
                <div className="flex flex-col text-center pt-2">
                    <p className="text-sm text-gray-500">
                        Don't have an account? 
                        <Link to="/signup" className="text-sky-600 hover:text-sky-800 ml-1 font-medium">Sign up</Link>
                    </p>
                </div>
            </div>
            
            {/* Footer: © 2026 Mankray */}
            <footer className="absolute bottom-4 text-xs text-gray-500">
                © 2026 Mankray
            </footer>
        </div>
    );
};

export default LoginScreen;
