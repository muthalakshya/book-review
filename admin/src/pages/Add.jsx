import React, { useState } from 'react'
import { Upload, Book, User, FileText, DollarSign, Star } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const Add = ({token}) => {
  const [image, setImage] = useState(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [genre, setGenre] = useState("Fantasy")
  const [bestseller, setBestseller] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('author', author)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('genre', genre)
      formData.append('bestseller', bestseller)
      formData.append('bookImage', image)
      
      const response = await axios.post("/books/add", formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          token 
        }
      })

      if(response.data.success){
        toast.success(response.data.message)
        // Reset form
        [setTitle, setAuthor, setDescription, setPrice, 
         setGenre, setBestseller, setImage].forEach(fn => fn(''))
        setGenre('Fantasy')
        setBestseller(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred")
    }
  }

  const GENRES = [
    "Fantasy", "Science Fiction", "Mystery", "Romance", 
    "Thriller", "Non-Fiction", "Biography", "History", "Self-Help"
  ]

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Add New Book
      </h2>

      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <label 
            htmlFor="bookImage" 
            className="cursor-pointer group relative"
          >
            <div className="w-48 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition">
              {image ? (
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Book Cover" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500 group-hover:text-blue-500">
                  <Upload className="w-12 h-12" />
                  <span>Upload Book Cover</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              id="bookImage"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden" 
            />
          </label>
        </div>

        {/* Book Details */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Title Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Title
            </label>
            <div className="flex items-center border rounded-md">
              <Book className="ml-3 text-gray-400" size={20} />
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
                className="w-full p-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Author Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <div className="flex items-center border rounded-md">
              <User className="ml-3 text-gray-400" size={20} />
              <input 
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
                className="w-full p-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Description
          </label>
          <div className="flex items-start border rounded-md">
            <FileText className="ml-3 mt-3 text-gray-400" size={20} />
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write book description"
              required
              className="w-full p-2 pl-10 min-h-[120px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Genre and Price */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Genre Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Genre
            </label>
            <select 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {GENRES.map(genreOption => (
                <option key={genreOption} value={genreOption}>
                  {genreOption}
                </option>
              ))}
            </select>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Price
            </label>
            <div className="flex items-center border rounded-md">
              <DollarSign className="ml-3 text-gray-400" size={20} />
              <input 
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="19.99"
                required
                className="w-full p-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bestseller Checkbox */}
        <div className="flex items-center">
          <input 
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestseller(prev => !prev)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label 
            htmlFor="bestseller" 
            className="ml-2 block text-sm text-gray-900 flex items-center"
          >
            <Star className="mr-1 text-yellow-500" size={16} />
            Mark as Bestseller
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button 
            type="submit" 
            className="w-full md:w-48 bg-blue-600 text-white py-3 rounded-md 
                       hover:bg-blue-700 transition duration-300 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Book
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add