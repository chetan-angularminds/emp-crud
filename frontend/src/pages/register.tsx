import React, { useState } from 'react';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        contactNumber: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        fullname: '',
        username: '',
        email: '',
        contactNumber: '',
        password: '',
        confirmPassword: '',
    });

    const validate = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (!formData.fullname) {
            newErrors.fullname = 'Full name is required';
            valid = false;
        } else {
            newErrors.fullname = '';
        }

        if (!formData.username) {
            newErrors.username = 'Username is required';
            valid = false;
        } else {
            newErrors.username = '';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Valid email is required';
            valid = false;
        } else {
            newErrors.email = '';
        }

        const contactNumberRegex = /^[0-9]{10}$/;
        if (!formData.contactNumber || !contactNumberRegex.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Valid contact number is required';
            valid = false;
        } else {
            newErrors.contactNumber = '';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else {
            newErrors.password = '';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        } else {
            newErrors.confirmPassword = '';
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // Submit form
            console.log('Form submitted', formData);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;