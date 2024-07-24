import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email dan password harus diisi" });
    }

    const user = await User.findOne({
      where: { email },
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    req.session.userId = user.uuid;
    const { uuid, name, role } = user;
    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ uuid, name, email, role });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const Me = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: { uuid: req.session.userId },
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const Logout = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(400).json({ msg: "User belum login" });
    }

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ msg: "Gagal logout" });
      res.clearCookie("refreshToken");
      res.status(200).json({ msg: "Logout berhasil" });
    });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};
