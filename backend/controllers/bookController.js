import fs from 'fs';
import {v2 as cloudinary} from "cloudinary"
import bookModel from "../models/bookModel.js"

const addBook = async (req, res) => {
    try {
        const { title, author, genre, price, description, bestseller } = req.body;

        // Check if an image file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Book cover image is required',
            });
        }

        let uploadedImageUrl = null;
        try {
            // Upload to Cloudinary using the correct file path
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
                folder: 'book_covers' // Organize uploads in folders
            });
            uploadedImageUrl = result.secure_url;
            console.log("Image uploaded to Cloudinary:", uploadedImageUrl);

            // Delete local file after uploading
            fs.unlinkSync(req.file.path);
        } catch (cloudinaryError) {
            console.error("Cloudinary upload error:", cloudinaryError);
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary",
                error: cloudinaryError.message
            });
        }

        // Create new book entry in the database
        const book = new bookModel({
            title,
            author,
            genre,
            price,
            description,
            bestseller: bestseller === 'true',
            image: uploadedImageUrl, // Store Cloudinary URL instead of local path
            reviews: []
        });

        await book.save();

        return res.status(201).json({
            success: true,
            message: 'Book added successfully',
            book
        });
    } catch (error) {
        console.error('Error adding book:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add book',
            error: error.message
        });
    }
};


  // Get all books
  const getAllBooks = async (req, res) => {
    try {
      const books = await bookModel.find().sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: books.length,
        books
      });
    } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch books',
        error: error.message
      });
    }
  };

  // Get book by ID
  const getBookById = async (req, res) => {
    try {
      const book = await bookModel.findById(req.params.id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        book
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch book',
        error: error.message
      });
    }
  };

  // Add review to a book
  const addReview = async (req, res) => {
    try {
      const { rating, text } = req.body;
      console.log(rating, text)
      // Validate input
      if (!rating || !text) {
        return res.status(400).json({
          success: false,
          message: 'Rating and text are required'
        });
      }
      
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
  
      const book = await bookModel.findById(req.params.id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
  
      // Create new review object
      const newReview = {
        user: req.user.id, // Assuming req.user is set by auth middleware
        email: req.user.email, // Assuming req.user has email
        rating: Number(rating),
        userName:req.user.name,
        text
      };
  
      // Add to reviews array
      book.reviews.push(newReview);
  
      await book.save();
  
      return res.status(201).json({
        success: true,
        message: 'Review added successfully',
        review: newReview
      });
    } catch (error) {
      console.error('Error adding review:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to add review',
        error: error.message
      });
    }
  };

  // Delete a book
  const deleteBook = async (req, res) => {
    try {
      const book = await bookModel.findById(req.params.id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
  
      // Delete book image from uploads folder
      if (book.image) {
        const imagePath = path.join(__dirname, '..', 'public', book.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
  
      await bookModel.findByIdAndDelete(req.params.id);
  
      return res.status(200).json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete book',
        error: error.message
      });
    }
  };

// Route to get books with reviews by email
const reviewBuEmail =  async (req, res) => {
  try {
    const  email  = req.user.email;
    console.log(email,req.user.email )

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find books that have reviews by the specified email
    const books = await bookModel.find({
      'reviews.email': email
    });
    console.log(books)

    return res.status(200).json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    console.error('Error fetching reviews by email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
}

export { addBook, getAllBooks, getBookById, addReview, deleteBook,reviewBuEmail };