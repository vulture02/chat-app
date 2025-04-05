import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => {
  try{
    const loggedInUser=req.user._id;
    const filtered=await User.find({_id:{$ne:loggedInUser}}).select("-password");
    res.status(200).json(filtered);
  }catch(error){
    console.log("Error in getUsersForSidebar:", error.message);
    res.status(500).json({message:"Server Error"});
  }
}
export const getMessage = async (req, res) => {
    try{
        const {id:userToChatId}=req.params;
        const myId=req.user._id;
        const message=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(message);

    }catch(error){
        console.log("Error in getMessage:", error.message);
        res.status(500).json({message:"Server Error"});
    }
};
export const sendMessage = async (req, res) => {
    try{
        const{text,image}=req.body;
        const {id: receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
           const uploadedResponse=await cloudinary.uploader.upload(image);
           imageUrl=uploadedResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();

        // tdodo :realtime functinoality goes here=>sclkot.io
            const receiverSocketId=getReceiverSocketId(receiverId);
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newMessage",newMessage)
            }

        res.status(200).json(newMessage);
    }catch(error){
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({message:"Server Error"});
    }
};