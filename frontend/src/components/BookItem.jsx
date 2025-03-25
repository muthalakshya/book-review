import React from 'react';
import { Link } from 'react-router-dom';

const BookItem = ({ id, title, author, price, image }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-red-50">
      <Link to={`/book/${id}`}>
        <div className="h-64 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-2">by {author}</p>
          <p className="text-blue-600 font-bold">${price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookItem;