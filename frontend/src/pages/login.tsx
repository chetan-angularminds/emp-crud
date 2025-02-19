/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToast } from '../services/toasts.service';
import AuthService from '../services/auth.service';

const LoginPage: React.FC = () => {
    const authService: AuthService = new AuthService();
    const Navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ userName?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ userName?: boolean; password?: boolean }>({});

    const validate = () => {
        const newErrors: { userName?: string; password?: string } = {};
        if (!userName && touched.userName) newErrors.userName = 'User Name is required';
        if (!password && touched.password) newErrors.password = 'Password is required';
        return newErrors;
    };
    
    React.useEffect(() => {
        setErrors(validate());
    }, [userName, password, touched]);

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            // Handle login logic here

            const response = await authService.login({ userName, password });
            console.log('userName:', userName);
            console.log('Password:', password);

            if(response.success){
                getToast("success",response.message);
                Navigate('/');
            } else {
                getToast("error",response.message)
            }

        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                            User Name
                        </label>
                        <input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onBlur={() => handleBlur('userName')}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                        {touched.userName && errors.userName && (
                            <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur('password')}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                        {touched.password && errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;