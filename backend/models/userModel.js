import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  profilePicture: {
    type: String , 
    default: "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-19.jpg"
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
  },
  games : {
    type: Array, // Array of game ids
    default: []
  }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10); // Generate salt
      this.password = await bcrypt.hash(this.password, salt); // Hash the password using salt
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
      {
          _id: this._id,
          name: this.name,
          email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,  
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY.toString() } 
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
      {
          _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,  // Secret key for refresh token
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY.toString() }  // Longer expiry time, e.g., 7 days
  );
};

const User = mongoose.model("User", userSchema);
export default User;
