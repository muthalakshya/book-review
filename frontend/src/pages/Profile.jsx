import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    profilePhoto: null,
    profilePhotoUrl: ''
  });
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          toast.error('Please login to view your profile');
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${backendUrl}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const user = response.data.user;
          setUserData({
            name: user.name || '',
            email: user.email || '',
            mobile: user.mobile || '',
            dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
            profilePhotoUrl: user.profilePhoto || ''
          });
          setPhotoPreview(user.profilePhoto || null);
        } else {
          toast.error(response.data.message || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Profile data fetch error:', error);
        const errorMessage = error.response?.data?.message || 'Error loading profile. Please try again.';
        toast.error(errorMessage);
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [backendUrl, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prevData => ({
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('mobile', userData.mobile);
      formData.append('dob', userData.dob);
      
      if (userData.profilePhoto) {
        formData.append('profilePhoto', userData.profilePhoto);
      }
      
      const response = await axios.put(
        `${backendUrl}/user/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setEditMode(false);
        
        // Update profile photo URL if returned in response
        if (response.data.user && response.data.user.profilePhoto) {
          setUserData(prevData => ({
            ...prevData,
            profilePhotoUrl: response.data.user.profilePhoto
          }));
        }
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Error updating profile. Please try again.';
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  if (loading && !userData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-blue-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-200 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          {/* <button
            onClick={handleLogout}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Log Out
          </button> */}
        </div>
        
        <div className="p-6">
          <div className="md:flex">
            {/* Profile Photo Section */}
            <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
              <div className="relative">
                <div className={`w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 ${editMode ? 'cursor-pointer' : ''}`} onClick={editMode ? triggerFileInput : undefined}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                {editMode && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 shadow-lg cursor-pointer" onClick={triggerFileInput}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden" 
                />
              </div>
              
              <h2 className="mt-4 text-2xl font-bold text-gray-800">{userData.name}</h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>
            
            {/* Profile Details Section */}
            <div className="md:w-2/3 md:pl-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      <p className="px-4 py-2 bg-blue-100 rounded-lg">{userData.name}</p>
                    )}
                  </div>
                  
                  {/* Email - Read Only */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <p className="px-4 py-2 bg-blue-100 rounded-lg">{userData.email}</p>
                    {editMode && (
                      <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                    )}
                  </div>
                  
                  {/* Mobile Number */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Mobile Number</label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="mobile"
                        value={userData.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-blue-100 rounded-lg">{userData.mobile || 'Not provided'}</p>
                    )}
                  </div>
                  
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Date of Birth</label>
                    {editMode ? (
                      <input
                        type="date"
                        name="dob"
                        value={userData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-blue-100 rounded-lg">
                        {userData.dob ? new Date(userData.dob).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  {editMode && (
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:opacity-95 transition-all"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;