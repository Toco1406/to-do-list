import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";


function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    }
  );
}

function setAuthCookie(res, token) {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000
  });
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      passwordHash
    });

    const token = createToken(user);

    setAuthCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User
      .findOne({ email })
      .select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = createToken(user);

    setAuthCookie(res, token);

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export function logout(req, res) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  return res.json({
    message: "Logout successful"
  });
}