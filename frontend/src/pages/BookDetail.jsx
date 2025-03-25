import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import axios from 'axios';

// Define backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userReview, setUserReview] = useState({ rating: 0, text: '' });
  const [userRatingHover, setUserRatingHover] = useState(0);

  // Fetch single book data
  const getBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backendUrl}/books/${bookId}`);
      if (response.data.success) {
        setBook(response.data.book);
        // Fetch related books after getting book details
      } else {
        setError('Failed to fetch book details: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Failed to fetch book details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  // Submit review to backend
  const submitReview = async (reviewData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to submit a review');
        return false;
      }
      console.log(reviewData)
      const response = await axios.post(
        `${backendUrl}/books/${bookId}/review`, 
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data)

      if (response.data.success) {
        return true;
      } else {
        toast.error(response.data.message || 'Failed to submit review');
        return false;
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again later.');
      return false;
    }
  };

  useEffect(() => {
    if (bookId) {
      getBook();
    }
  }, [bookId]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleRatingClick = (rating) => {
    setUserReview(prev => ({ ...prev, rating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (userReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (userReview.text.trim() === '') {
      toast.error('Please enter a review');
      return;
    }

    const reviewData = {
      rating: userReview.rating,
      text: userReview.text
    };

    const success = await submitReview(reviewData);
    
    if (success) {
      toast.success('Review submitted successfully!');
      setUserReview({ rating: 0, text: '' });
      // Refresh book data to include the new review
      getBook();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 bg-gray-200 h-96 rounded-lg"></div>
          <div className="md:w-2/3">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Book</h1>
        <p className="mb-8">{error}</p>
        <button 
          onClick={getBook} 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-4"
        >
          Try Again
        </button>
        <Link to="/books" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
          Return to Book Catalog
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the book you're looking for.</p>
        <Link to="/books" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Return to Book Catalog
        </Link>
      </div>
    );
  }

  const averageRating = calculateAverageRating(book.reviews || []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Book details section */}
      <div className="flex flex-col md:flex-row gap-8 border-b pb-8">
        {/* Book cover image */}
        <div className="md:w-1/3">
          <img 
            src={book.image} 
            alt={book.title} 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Book information */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-xl text-gray-600 mb-4">by {book.author}</h2>
          
          {/* Rating display */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => {
                if (star <= Math.floor(averageRating)) {
                  return <FaStar key={star} />;
                } else if (star === Math.ceil(averageRating) && !Number.isInteger(averageRating)) {
                  return <FaStarHalfAlt key={star} />;
                } else {
                  return <FaRegStar key={star} />;
                }
              })}
            </div>
            <span className="ml-2 text-gray-600">
              {averageRating} ({(book.reviews || []).length} {(book.reviews || []).length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          
          {/* Price and genre */}
          <div className="mb-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">${book.price?.toFixed(2) || '0.00'}</div>
            <div className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm">
              {book.genre}
            </div>
          </div>
          
          {/* Book details */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm mb-6">
            {book.publishDate && (
              <>
                <div className="text-gray-600">Publication Date:</div>
                <div>{book.publishDate}</div>
              </>
            )}
            {book.publisher && (
              <>
                <div className="text-gray-600">Publisher:</div>
                <div>{book.publisher}</div>
              </>
            )}
            {book.pages && (
              <>
                <div className="text-gray-600">Pages:</div>
                <div>{book.pages}</div>
              </>
            )}
            {book.isbn && (
              <>
                <div className="text-gray-600">ISBN:</div>
                <div>{book.isbn}</div>
              </>
            )}
          </div>
          
          {/* Add to cart button */}
          <div className="flex gap-4 mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex-grow md:flex-grow-0">
              Add to Cart
            </button>
            <button className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg transition-colors duration-300">
              Add to Wishlist
            </button>
          </div>
          
          {/* Shipping info */}
          <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free shipping on orders over $35
            </div>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free returns within 30 days
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Secure payment processing
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="mt-8 border-b">
        <div className="flex">
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'description' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({(book.reviews || []).length})
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="py-6">
        {activeTab === 'description' ? (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
        ) : (
          <div>
            {/* Write a review section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-medium mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Rating:</label>
                  <div className="flex text-2xl">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <span 
                        key={rating}
                        className="cursor-pointer text-yellow-400"
                        onClick={() => handleRatingClick(rating)}
                        onMouseEnter={() => setUserRatingHover(rating)}
                        onMouseLeave={() => setUserRatingHover(0)}
                      >
                        {rating <= (userRatingHover || userReview.rating) ? <FaStar /> : <FaRegStar />}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="review" className="block text-gray-700 mb-2">Your Review:</label>
                  <textarea
                    id="review"
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userReview.text}
                    onChange={(e) => setUserReview(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Share your thoughts about this book..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-300"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Reviews list */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                {(book.reviews || []).length > 3 && (
                  <button 
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {showAllReviews ? 'Show Less' : 'View All Reviews'}
                  </button>
                )}
              </div>

              {(!book.reviews || book.reviews.length === 0) ? (
                <p className="text-gray-500 italic">No reviews yet. Be the first to review this book!</p>
              ) : (
                <div className="space-y-6">
                  {(showAllReviews ? book.reviews : book.reviews.slice(0, 3)).map((review) => (
                    <div key={review._id || review.id} className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{review.user?.name || review.userName || 'Anonymous'}</span>
                        <span className="text-gray-500 text-sm">
                          {review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= review.rating ? <FaStar /> : <FaRegStar />}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default BookDetail;