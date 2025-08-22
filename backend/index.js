const express = require("express");
const connectDB = require("./models/connect");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const notesRouter = require("./routes/noteRoutes");
const defaultRouter = require("./routes/defaultRoute");
const cron = require("node-cron");
const request = require("request");

const RealTimeNotesApp = express();

connectDB();

RealTimeNotesApp.use(express.json());
RealTimeNotesApp.use(
  cors({
    origin: "http://localhost:3000",
  })
);

RealTimeNotesApp.use("/api", userRouter);
RealTimeNotesApp.use("/api", notesRouter);
RealTimeNotesApp.use("", defaultRouter);

cron.schedule("*/5 * * * *", () => {
  console.log(
    "⏰ Scheduled ping at",
    new Date().toLocaleDateString(),
    `${new Date().getHours()}:${new Date().getMinutes()}`
  );

  request("https://hack-o-rama.onrender.com/ping", (error, response) => {
    if (!error && response.statusCode === 200) {
      console.log("✅ Server is alive (ping success)");
    }
  });
});

const PORT = process.env.PORT || 8000;

RealTimeNotesApp.listen(PORT, () => {
  console.log(`🚀 RealTimeNotesApp backend running on port ${PORT}`);
});
