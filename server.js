const express = require("express");
const cors = require("cors");

require("colors");
require("dotenv").config();

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// * Initialize Express server
const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`.red);
});

// * Connect to Database
connectDB();

// * Defining routes
app.use("/auth", require("./routes/auth.api"));
app.use("/user", require("./routes/user.api"));
