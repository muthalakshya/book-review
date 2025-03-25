import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookReviewsByEmail = () => {
  // Backend URL from environment variable
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // State management
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [userData, setUserData] = useState('');

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
          setUserData(user.email);
          console.log(user.email)
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

  // Fetch reviews by email
  const fetchReviewsByEmail = async () => {
    try {
      // Reset states
      setLoading(true);
      setError(null);

      // Get authentication token
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to view reviews');
        setLoading(false);
        return;
      }

      // Fetch reviews
      const response = await axios.post(
        `${backendUrl}/books/review`, 
        {}, // Empty body as per your backend implementation
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Handle successful response
      if (response.data.success) {
        // Filter books with user's reviews
        const booksWithUserReviews = response.data.books.filter(book => 
          book.reviews.length > 0
        );
        console.log(booksWithUserReviews)
        setReviews(booksWithUserReviews);
      } else {
        toast.error(response.data.message || 'Failed to fetch reviews');
      }
      
      setLoading(false);
    } catch (err) {
      // Handle errors
      const errorMessage = err.response?.data?.message || 'Failed to fetch reviews';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      console.error('Error fetching reviews:', err);
    }
  };

  // Fetch reviews on component mount and when token changes
  useEffect(() => {
    fetchReviewsByEmail();
  }, []);

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        size={20}
        color={index < rating ? 'gold' : 'gray'} 
        fill={index < rating ? 'gold' : 'none'}
      />
    ));
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading reviews...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        {error}
        <button 
          onClick={fetchReviewsByEmail} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full  p-6">
      <h1 className="text-2xl font-bold mb-6">My Book Reviews</h1>
      
      {reviews.length === 0 ? (
        <div className="text-center text-gray-500 p-6 border rounded">
          No reviews found.
        </div>
      ) : (
        reviews.map((book) => (
          <div 
            key={book._id} 
            className="mb-6 p-4 border rounded-lg shadow-sm"
          >
            <div className="flex items-center mb-4">
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-24 h-36 object-cover mr-4 rounded"
              />
              <div>
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
              </div>
            </div>
            
            {book.reviews.map((review, index) => (
              review.email == userData ? <div 
              key={index} 
              className="bg-gray-50 p-4 rounded-lg mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <span className="text-gray-500 text-sm">
                  {formatDate(review.date)}
                </span>
              </div>
              <p>{review.text}</p>
            </div>: null
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default BookReviewsByEmail;