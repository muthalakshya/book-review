import fs from 'fs';
import validator from 'validator';
import bcrypt from  'bcryptjs';
import jwt from "jsonwebtoken";  // Import jsonwebtoken
import userModel from '../models/userModel.js';  // Keep the .js extension
import {v2 as cloudinary} from "cloudinary"

// Function to create JWT token
const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '48h' });
};

// Route for user login
const loginUser = async (req, res) => {
    // Implement login logic here
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({email});

        if (!user)
            return res. json({success:false, message: "User doesn't exists"})

        const isMatch = await bcrypt. compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            res.json({success : true, token})
        }
        else {
            res.json({success: false, message: 'Invalid credentials'})
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        // Log incoming data for debugging
        console.log("Files:", req.file);
        console.log("Body:", req.body);

        const { name, email, password, mobile, dob } = req.body;
        let profilePhoto = req.file; // Multer makes the file available here

        // Validate required fields
        if (!name || !email || !password || !dob || !mobile) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format and password strength
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (minimum 8 characters)" });
        }

        let profUrl = null;
        if (profilePhoto) {
            try {
                // Upload the image to Cloudinary
                const result = await cloudinary.uploader.upload(profilePhoto.path, {
                    resource_type: 'image',
                    folder: 'user_profiles' // Organize uploads in folders
                });
                profUrl = result.secure_url;
                console.log("Profile photo uploaded to Cloudinary:", profUrl);
                
                // Delete the local file after uploading to Cloudinary
                fs.unlinkSync(profilePhoto.path);
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                // Continue with registration even if image upload fails
            }
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            mobile,
            dob,
            profilePhoto: profUrl
        });

        console.log("New user object:", newUser);

        // Save the user to the database
        const user = await newUser.save();

        // Generate a JWT token
        const token = createToken(user._id);

        // Return success response
        res.json({ 
            success: true, 
            message: "User created successfully", 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto
            }
        });
    } catch (error) {
        console.log("Error in user registration:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    // Implement admin login logic here
    try {
        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt. sign(email+password, process. env. JWT_SECRET);
            res.json( {success : true, token} )
        } else {
            res.json( {success: false, message: "Invalid credentials"})
        }
    } catch(error) {
        console.log(error);
        res.json({ success: false, message: error.message})
    }
};

// GET user profile by ID
const getUserProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Find the user by ID and exclude password field
      const user = await userModel.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      res.json({ 
        success: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          dob: user.dob,
          profilePhoto: user.profilePhoto
        }
      });
    } catch (error) {
      console.log("Error fetching user profile:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // Update user profile
  const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, email, mobile, dob } = req.body;
      const profilePhoto = req.file;
      
      // Find user first to check if they exist
      const user = await userModel.findById(userId);
    //   console.log(user)
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Prepare update object
      const updateData = {};
      
      // Only update fields that were provided
      if (name) updateData.name = name;
      if (email) {
        // If email is being changed, validate and check for duplicates
        if (email !== user.email) {
          if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
          }
          
          const emailExists = await userModel.findOne({ email, _id: { $ne: userId } });
          if (emailExists) {
            return res.json({ success: false, message: "Email already in use" });
          }
          
          updateData.email = email;
        }
      }
      if (mobile) updateData.mobile = mobile;
      if (dob) updateData.dob = dob;
      
      // Handle profile photo update if provided
      let profUrl = user.profilePhoto; // Keep existing photo by default
      if (profilePhoto) {
        try {
          // Upload the new image to Cloudinary
          const result = await cloudinary.uploader.upload(profilePhoto.path, {
            resource_type: 'image',
            folder: 'user_profiles'
          });
          profUrl = result.secure_url;
          
          // Delete the local file after uploading to Cloudinary
          fs.unlinkSync(profilePhoto.path);
          
          updateData.profilePhoto = profUrl;
        } catch (cloudinaryError) {
          console.error("Cloudinary upload error:", cloudinaryError);
          // Continue with update even if image upload fails
        }
      }
      
      // Update user in database
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');
      
      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          dob: updatedUser.dob,
          profilePhoto: updatedUser.profilePhoto
        }
      });
    } catch (error) {
      console.log("Error updating user profile:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile };