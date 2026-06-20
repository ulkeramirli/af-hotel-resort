import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtp } from "@/lib/generate-otp";
import { sendMail } from "@/lib/send-email";
import { verifyEmailTemplate } from "@/lib/emails/verify-email";
export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    const mail = verifyEmailTemplate(name, otp);
    await sendMail(email, mail.subject, mail.html);
    return {
      message: "Verification code sent to email",
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!user.isVerified) {
      throw new Error("Please verify your email first");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
  static async verifyOTP(email: string, otp: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }
    if (user.otpExpires < new Date()) {
      throw new Error("OTP expired");
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return {
      message: "Email verified successfully",
    };
  }
}
