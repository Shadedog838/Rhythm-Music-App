// Express for hosting
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require("cors")
const port = 5000|process.env.SERVER_PORT;


// middleware
app.use(express.json());
app.use(cors());


//app.use("/user", require("./routes/userRouter"));
app.use("/song", require("./routes/songRouter"));
app.use("/user", require("./routes/userRouter"))

// Start listening on the specified port
app.listen(port, () => {
    console.log(`Program listening on port ${port}`);
});

