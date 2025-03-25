import React from 'react';
import { Link } from 'react-router-dom';

// Sample book data - in a real app this would be fetched or passed as props
const books = [
  { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', price: 12.99, image: '/images/gatsby.jpg' },
  { _id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', price: 14.99, image: '/images/mockingbird.jpg' },
  { _id: '3', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', price: 16.99, image: '/images/hobbit.jpg' },
  { _id: '4', title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', price: 18.99, image: '/images/dune.jpg' },
  { _id: '5', title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', price: 10.99, image: '/images/alchemist.jpg' },
  { _id: '6', title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy', price: 24.99, image: '/images/harrypotter.jpg' },
  { _id: '7', title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', price: 15.99, image: '/images/silentpatient.jpg' },
  { _id: '8', title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', price: 20.99, image: '/images/atomichabits.jpg' },
];

const RelatedBooks = ({ genre, currentBookId }) => {
  // Filter books by genre and exclude current book
  const relatedBooks = books.filter(book => 
    book.genre === genre && book._id !== currentBookId
  ).slice(0, 4); // Limit to 4 related books

  if (relatedBooks.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {relatedBooks.map(book => (
          <div key={book._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link to={`/book/${book._id}`}>
              <div className="h-48 overflow-hidden">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
                <p className="text-gray-600 text-sm">{book.author}</p>
                <p className="text-blue-600 font-bold mt-2">${book.price.toFixed(2)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedBooks;