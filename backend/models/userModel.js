import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // cartData: { type: Object, default: {} },
    mobile: { type: String, required: true },
    dob: { type: String, required: true },
    profilePhoto: { type: String, default: '' },
}, { minimize: false })

const userModel =  mongoose.models.user || mongoose.model('user', userSchema);

export  default userModel;