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
});

// pre is Middleware from mongoose... its used here before save operation to hash the password before saving
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

//Once the user logs-in, the backend server generates the access token using below method, the token is sent to the front-end. 
//The client then includes this token in the Authorization header for subsequent API requests.
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
      {
          _id: this._id,
          name: this.name,
          email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,  // Secret key should be kept secure
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY.toString() }  // Short expiry time, e.g., 15 minutes
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


//When the access token expires, the client gets  HTTP 401 Unauthorized error.(indicating that the token has expired).

//At this point, the client sends the refresh token to the server in order to obtain a new access token.
//The server verifies the refresh token and generates a new access token using the following method:
//Refresh tokens are used to extend user sessions without requiring the user to log in repeatedly.
//access token (short-lived) and a refresh token (long-lived).

// improvements :
//You can implement token revocation on the server by blacklisting already used refresh tokens (this can be done by storing the refresh token in the database and marking it as revoked when the user logs out or the token is compromised).
