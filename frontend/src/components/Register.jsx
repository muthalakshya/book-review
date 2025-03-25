import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '', // Added mobile field
    password: '',
    confirmPassword: '',
    dob: '',
    profilePhoto: null
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    error: null
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const fileInputRef = useRef(null);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        profilePhoto: file
      }));

      // Create URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate password match
  //   if (formData.password !== formData.confirmPassword) {
  //     setFormStatus({
  //       isSubmitting: false,
  //       error: "Passwords don't match"
  //     });
  //     toast.error("Passwords don't match");
  //     return;
  //   }

  //   setFormStatus({ isSubmitting: true, error: null });

  //   // Create form data for file upload
  //   const submitDataObj = {
  //     name: formData.name,
  //     email: formData.email,
  //     password: formData.password,
  //     dob: formData.dob,
  //     mobile: formData.mobile,
  //     profilePhoto: formData.profilePhoto ? formData.profilePhoto : null
  //   }
  //   console.log(formData.profilePhoto)
  //   try {
  //     const response = await axios.post(`${backendUrl}/api/user/register`, submitDataObj);

  //     if (response.data.success) {
  //       toast.success('Registration successful! Please sign in.');
  //       navigate('/login');
  //     } else {
  //       toast.error(response.data.message || 'Registration failed');
  //       setFormStatus({
  //         isSubmitting: false,
  //         error: response.data.message || 'Registration failed'
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
  //     toast.error(errorMessage);
  //     setFormStatus({
  //       isSubmitting: false,
  //       error: errorMessage
  //     });
  //   }
  // };
  
// In your React component's handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate password match
  if (formData.password !== formData.confirmPassword) {
    setFormStatus({
      isSubmitting: false,
      error: "Passwords don't match"
    });
    toast.error("Passwords don't match");
    return;
  }

  setFormStatus({ isSubmitting: true, error: null });

  // Create FormData object for file upload
  const submitData = new FormData();
  submitData.append('name', formData.name);
  submitData.append('email', formData.email);
  submitData.append('password', formData.password);
  submitData.append('dob', formData.dob);
  submitData.append('mobile', formData.mobile);
  
  // Only append the file if it exists
  if (formData.profilePhoto) {
    submitData.append('profilePhoto', formData.profilePhoto);
  }

  try {
    const response = await axios.post(
      `${backendUrl}/user/register`, 
      submitData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } else {
      toast.error(response.data.message || 'Registration failed');
      setFormStatus({
        isSubmitting: false,
        error: response.data.message || 'Registration failed'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
    toast.error(errorMessage);
    setFormStatus({
      isSubmitting: false,
      error: errorMessage
    });
  }
};
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left side - Header for mobile, Side banner for desktop */}
        <div className="w-full md:w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white text-center">Create Your Account</h2>
          <div className="flex justify-center mt-2">
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </div>
          <p className="text-white text-center mt-4 hidden md:block">
            Join our community and enjoy all the benefits of our platform.
          </p>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-screen">
          {formStatus.error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              {formStatus.error}
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Photo Upload */}
            <div className="flex justify-center mb-4">
              <div 
                onClick={triggerFileInput}
                className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-blue-500 hover:opacity-90 transition-all"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />
              {/* <input onChange={(e)=>setImage1(e.target.files[0])}  id="image1" /> */}
            </div>
            <div className="flex justify-center mb-6">
              <button 
                type="button" 
                onClick={triggerFileInput}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {photoPreview ? 'Change Photo' : 'Upload Profile Photo'}
              </button>
            </div>
            
            {/* Two-column layout for form fields on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              {/* Mobile Number - New Field */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Your mobile number"
                  />
                </div>
              </div>
              
              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {passwordVisible ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={formStatus.isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all ${formStatus.isSubmitting ? 'opacity-70' : 'hover:scale-105'}`}
              >
                {formStatus.isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;