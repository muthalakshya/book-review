import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Sample featured books data
  const featuredBooks = [
    { id: 1, title: "The Midnight Library", author: "Matt Haig", cover: "/api/placeholder/120/180", rating: 4.5, genre: "Fiction" },
    { id: 2, title: "Atomic Habits", author: "James Clear", cover: "/api/placeholder/120/180", rating: 4.8, genre: "Self-Help" },
    { id: 3, title: "Project Hail Mary", author: "Andy Weir", cover: "/api/placeholder/120/180", rating: 4.7, genre: "Sci-Fi" },
    { id: 4, title: "Educated", author: "Tara Westover", cover: "/api/placeholder/120/180", rating: 4.6, genre: "Memoir" },
  ];

  // Sample genres for filtering
  const genres = ["All", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Romance", "Mystery", "Biography", "Self-Help", "History"];
  
  // Sample recent reviews
  const recentReviews = [
    { id: 1, bookTitle: "The Midnight Library", username: "bookworm22", rating: 5, snippet: "A thought-provoking journey that makes you appreciate life's possibilities..." },
    { id: 2, bookTitle: "Atomic Habits", username: "growthMindset", rating: 4, snippet: "Practical advice that has genuinely changed my daily routines..." },
  ];

  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? "text-yellow-500" : "text-gray-300"}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      

      {/* Hero section with search */}
      <section className="bg-indigo-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Your Next Favorite Book</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join our community of readers. Browse thousands of books, share your thoughts, and find your next great read.</p>
          
          <div className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg">
              <input 
                type="text" 
                placeholder="Search by title, author, or ISBN..." 
                className="w-full px-4 py-3 text-gray-700 focus:outline-none" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-6 sm:px-16 py-8">
        {/* Genre filtering */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Browse by Genre</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button 
                key={genre} 
                className={`px-4 py-2 rounded-full ${activeGenre === genre ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => setActiveGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {/* Featured books */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Featured Books</h3>
            <Link to="/book">
              <a href="#" className="text-indigo-600 hover:text-indigo-800">View all →</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex">
                    <img src={book.cover} alt={book.title} className="w-20 h-32 object-cover rounded" />
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg mb-1">{book.title}</h4>
                      <p className="text-gray-600 mb-2">by {book.author}</p>
                      <div className="flex mb-1">
                        {renderStars(book.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{book.genre}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Read Reviews</button>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Add Review</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent reviews */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Recent Reviews</h3>
            <a href="#" className="text-indigo-600 hover:text-indigo-800">More reviews →</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentReviews.map(review => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold">{review.bookTitle}</h4>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">"{review.snippet}"</p>
                <p className="text-gray-500 text-sm">By {review.username}</p>
                <a href="#" className="block mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">Read full review →</a>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-indigo-100 rounded-xl p-8 text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">Share Your Reading Experience</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Join thousands of book lovers who share their thoughts and discover new books every day.</p>
          <Link to="/register">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md">Create an Account</button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">BookReviews</h4>
              <p className="text-gray-400">Your community for discovering and discussing great books.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Explore</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Top Books</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">New Releases</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Genres</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Authors</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Reading Challenges</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Book Clubs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Forums</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Events</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 BookReviews. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;