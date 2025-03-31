const express = require("express");
const UserModel = require("../models/usermodel");
const { authToken } = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { phone, otp } = req.body;
  const userSave = new UserModel({
    phone,
    // otp,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  await userSave.save();
  res.status(201).json({ message: "User registered successfully!" });
});

authRouter.post("/login", async (req, res) => {
  const { phone } = req.body;
  console.log(phone)
  const getUser = await UserModel.findOne({ phone: phone });
  if (!getUser) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful!", token: authToken(getUser._id) });
});

authRouter.get("/customer", async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
});

authRouter.put("/customer/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "user updated Successfully" });
  }
  return res.status(400).json({ message: "user not found" });
});

authRouter.delete("/customer/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    await UserModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "user deleted Successfully" });
  }
  return res.status(400).json({ message: "user not found" });
});

module.exports = authRouter;
