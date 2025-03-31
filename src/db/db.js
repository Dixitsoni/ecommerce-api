const mongoose = require("mongoose");

const connectDB = () => mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Database connected successfully");
}).catch(err => {
  console.log("failed to connect to database");
})


module.exports = connectDB;
