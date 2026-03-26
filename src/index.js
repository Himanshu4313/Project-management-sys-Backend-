// load .env file 
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectToDB from "./db/index.js";

const PORT = process.env.PORT || 3000;

connectToDB()
    .then((resolve) => {

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((reject) => {
        console.log("Error:-" + reject);
    })
