const express = require("express");
const app = express();
const cors = require("cors");
// const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require("./routes/userController");
const productRouter = require("./routes/productController");
const path = require('path')
dotenv.config();
app.use(cors());
// const authRoute = require("./routes/auth");
// const userRoute = require("./routes/users");
// const postRoute = require("./routes/posts");
// const categoryRoute = require("./routes/categories");
// const multer = require("multer");
// const path = require("path");
app.get('/', (req, res) => {
  res.send('welcome to my api')
})
const db = require('./db/db')
db()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(authRouter)
app.use(productRouter)




app.listen(8080, () => {
  console.log(`server is running on port 8080`);
});
