import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function tokenFor(user) {
  return jwt.sign({id: user._id.toString(), role: user.role}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

export async function register(req, res, next) {
  try {
    const {name, email, password} = req.body;
    if (!name || !email || !password || password.length < 6) return res.status(400).json({message: "Name, email, and a password of at least 6 characters are required"});
    if (await User.exists({email: email.toLowerCase()})) return res.status(409).json({message: "Email is already registered"});
    const user = await User.create({name, email, passwordHash: await bcrypt.hash(password, 12)});
    res.status(201).json({user, token: tokenFor(user)});
  } catch (error) { next(error); }
}

export async function login(req, res, next) {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email: email?.toLowerCase()}).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) return res.status(401).json({message: "Invalid email or password"});
    res.json({user, token: tokenFor(user)});
  } catch (error) { next(error); }
}

export function profile(req, res) { res.json(req.user); }
