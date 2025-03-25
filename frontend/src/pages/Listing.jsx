import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import BookItem from '../components/BookItem';
import axios from 'axios';

// Define backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const BookListing = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('relevant');

  // Function to fetch books from backend
  const getBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/books/all`);
      
      if (response.data.success) {
        console.log('Books fetched successfully:', response.data.books);
        setBooks(response.data.books);
        setFilteredBooks(response.data.books); // Initialize filtered books with all books
        setError(null);
      } else {
        setError('Failed to fetch books: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch books on component mount or when auth token changes
  useEffect(() => {
    getBooks();
  }, [localStorage.getItem('authToken')]);

  // Get unique genres for filter
  const genres = [...new Set(books.map(book => book.genre))].filter(Boolean);

  // Toggle genre selection
  const toggleGenre = (e) => {
    if (selectedGenres.includes(e.target.value)) {
      setSelectedGenres(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSelectedGenres(prev => [...prev, e.target.value]);
    }
  };

  // Apply filters and search
  const applyFilters = () => {
    let booksToDisplay = [...books];

    // Apply search
    if (searchQuery) {
      booksToDisplay = booksToDisplay.filter(book => 
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      booksToDisplay = booksToDisplay.filter(book => selectedGenres.includes(book.genre));
    }

    // Apply sorting
    switch (sortType) {
      case 'low-high':
        booksToDisplay.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        booksToDisplay.sort((a, b) => b.price - a.price);
        break;
      case 'a-z':
        booksToDisplay.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        booksToDisplay.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order for 'relevant'
        break;
    }

    setFilteredBooks(booksToDisplay);
  };

  // Apply filters whenever search, genres, sort, or books change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedGenres, sortType, books]);

  return (
    <div className="container mx-auto px-4 py-8 bg-blue-100">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-2 top-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="md:w-1/4">
          <div className="flex items-center justify-between md:justify-start md:mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button 
              onClick={() => setShowFilter(!showFilter)} 
              className="md:hidden ml-2 p-1 rounded-md"
            >
              {showFilter ? '−' : '+'}
            </button>
          </div>

          <div className={`${showFilter ? 'block' : 'hidden'} md:block`}>
            <div className="border border-gray-300 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-3">Genres</h3>
              {genres.length > 0 ? (
                <div className="space-y-2">
                  {genres.map((genre) => (
                    <div key={genre} className="flex items-center">
                      <input
                        id={genre}
                        type="checkbox"
                        value={genre}
                        checked={selectedGenres.includes(genre)}
                        onChange={toggleGenre}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={genre} className="ml-2 text-gray-700">
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No genres available</p>
              )}
            </div>
          </div>
        </div>

        {/* Book Listings */}
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <Title text1={'BOOK'} text2={'COLLECTION'} />
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-300 text-sm px-2 py-1 rounded"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Price Low to High</option>
              <option value="high-low">Sort by: Price High to Low</option>
              <option value="a-z">Sort by: Title A-Z</option>
              <option value="z-a">Sort by: Title Z-A</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">Loading books...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-lg text-red-600">{error}</p>
              <button 
                onClick={getBooks}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No books found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenres([]);
                  setSortType('relevant');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookItem
                  key={book._id}
                  id={book._id}
                  title={book.title}
                  author={book.author}
                  price={book.price}
                  image={book.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookListing;