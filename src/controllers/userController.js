import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const createUser = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      throw new ApiError(409, "Email already exists");
    }

    const user = await User.create({
      name: req.body.name,
      email,
      password: req.body.password,
      role: req.body.role,
      status: req.body.status
    });

    res.status(201).json({ message: "User created", data: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const safeUsers = users.map((user) => user.toSafeObject());
    res.status(200).json({ message: "Users fetched", data: safeUsers });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({ message: "User fetched", data: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }

    if (req.body.role !== undefined) {
      user.role = req.body.role;
    }

    if (req.body.status !== undefined) {
      user.status = req.body.status;
    }

    await user.save();
    res.status(200).json({ message: "User updated", data: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

