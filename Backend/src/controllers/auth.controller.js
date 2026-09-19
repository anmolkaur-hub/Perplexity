import "dotenv/config";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

function createVerificationToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await userModel.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    const user = await userModel.create({
      username: username.trim(),
      email: normalizedEmail,
      password,
      verified: process.env.SKIP_EMAIL_VERIFICATION === "true",
    });

    if (process.env.SKIP_EMAIL_VERIFICATION !== "true") {
      const token = createVerificationToken(user.email);
      const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";

      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your Perplexity account",
          html: `
            <p>Hi ${user.username},</p>
            <p>Click the link below to verify your account:</p>
            <a href="${baseUrl}/api/auth/verify-email?token=${token}">Verify Email</a>
          `,
        });
      } catch (mailError) {
        await userModel.findByIdAndDelete(user._id);
        return res.status(500).json({
          success: false,
          message: "Registration created no account because verification email could not be sent",
          error: mailError.message,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message:
        process.env.SKIP_EMAIL_VERIFICATION === "true"
          ? "Registration successful. You can log in now."
          : "Registration successful. Please verify your email before logging in.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.verified = true;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/login?verified=true`);
  } catch (error) {
    return res.status(400).send("Invalid or expired verification link");
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({ success: true, message: "Logged out" });
}

export async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
}
