import mongoose from "mongoose" ;

const reviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      // required: true
    },
    email: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
});

const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    genre: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    bestseller: {
      type: Boolean,
      default: false
    },
    reviews: [reviewSchema],
    createdAt: {
      type: Date,
      default: Date.now
    }
});

const bookModel = mongoose.models.book || mongoose.model("Book", bookSchema);

export default bookModel