const express = require("express");
const connectDB = require("./models/connect");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const notesRouter = require("./routes/noteRoutes");
const defaultRouter = require("./routes/defaultRoute");
const cron = require('node-cron');
const request = require('request');


//initialize express
const app = express();

//create db connection
connectDB();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));

//allow 3000
// corsOptions = {
//     origin: "http://localhost:3000"
// }

// app.use(cors(corsOptions));


// //
app.use("/api", userRouter);
app.use("/api", notesRouter);
app.use("", defaultRouter);

cron.schedule("*/5 * * * *", () =>
{
    console.log("Sending scheduled request at", new Date().toLocaleDateString(), "at", `${new Date().getHours()}:${new Date().getMinutes()}`);
    request('https://hack-o-rama.onrender.com/ping', function (error, response, body)
    {
        if (!error && response.statusCode == 200)
        {
            console.log("im okay");
            // console.log(body) // Optionally, log the response body
        }
    });
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
{
    console.log(`⚡Server is running on port ${PORT}`);
});
