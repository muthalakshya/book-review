import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaMagnifyingGlassPlus } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cards = ({ imgProd, productId, name, description, price,  sizes }) => {
  const navigate = useNavigate();
  // console.log(imgProd, productId, name, description, price,  sizes)

  return (
    <div
      className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden relative group"
      onClick={() => navigate(`/home-decor/${productId}`)}
    >
      <img src={imgProd} alt="Product" className="w-full h-80 object-cover" />
      <div className="p-4 text-center">
        <h2 className="text-sm font-medium text-gray-800">{name}</h2>
        <p className="text-lg font-bold text-gray-600 my-2">${price}</p>
      </div>
      <div className="absolute top-4 right-4 bg-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2 shadow-lg">
        <FaRegHeart className="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer" />
        <FaMagnifyingGlassPlus className="h-6 w-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
        <FaShareAlt className="h-6 w-6 text-gray-600 hover:text-green-500 cursor-pointer" />
      </div>
    </div>
  );
};

export default Cards;
