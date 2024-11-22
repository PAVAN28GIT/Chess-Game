import passport from "passport";
import User from "../models/userModel.js";
import dotenv from 'dotenv';

dotenv.config();

// Register a new user
export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }
    const user = new User({ email, password, name });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "An error occurred" });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const jwtToken = user.generateAccessToken();

    res.cookie("jwtToken", jwtToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });


    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        _id: user._id,
      },
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// starting point of Google OAuth authentication
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"], 
});

// callback after Google has authenticated the user
export const googleAuthCallback = (req, res) => {
  passport.authenticate("google", (err, jwtToken ,user) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/sign-in`);
    }
    if (jwtToken) {
      res.cookie("jwtToken", jwtToken ,{
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?user=${user._id}`);
    }
    return res.redirect(`${process.env.FRONTEND_URL}/sign-in`);
  })(req, res);
};

//logout
export const logout = async (req, res) => {
  res.clearCookie("jwtToken", {
    httpOnly: true,  
    secure: true,   
    sameSite: "None", 
  });
  
  res.json({ message: "Logged out" });
};