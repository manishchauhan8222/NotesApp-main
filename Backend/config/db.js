import mongoose from "mongoose";

const DbCon = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://manishchauhan822282:ManishDatabase@cluster0.5sfp22x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("Error in MongoDB connection", error);
  }
};

export default DbCon;
