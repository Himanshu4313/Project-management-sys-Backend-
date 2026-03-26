import mongoose from "mongoose";


const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DataBase Connection Successfully Done.");
    } catch (error) {
        console.error("DataBase connection failed." + error);
        // if the database connection is failed so, no need to process further 
        process.exit(1);
    }
}

export default connectToDB;