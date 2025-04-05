import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res
        .status(201)
        .json({
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
        });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(user._id, res);
    res
      .status(200)
      .json({ _id: user._id, fullname: user.fullname, email: user.email });
  } catch (error) {
    console.log("Error in login:", error.message);
    res.status(500).json({ message: "Internal error Server Error" });
  }
};
export const logout = (req, res) => {
  try{
    res.clearCookie("jwt","",{maxAge:0});
    res.status(200).json({ message: "Logged out successfully" });
  }catch(error){
    console.log("Error in logout:", error.message);
    res.status(500).json({ message: "Internal error Server Error" });
  }
};
export const updateProfile =async (req, res) => {
    try{

        const {profilePic}=req.body;
        const userId=req.user._id
        if(!profilePic){
            return res.status(400).json({message:"Please provide profile picture"});
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        res.status(200).json(updateUser);

    }catch(error){
        console.log("Error in updateProfile:", error.message);
        res.status(500).json({message:"Server Error"});
    }

};

export const checkAuth = async (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth:", error.message);
        res.status(500).json({message:"Server Error"});
    }
}
