import { v4 as uuidv4 } from "uuid";
import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(email, name, password);
    if (!(email && email.toLowerCase() && password && name)) {
      res.status(400).send("All input is required");
    }
    const id = uuidv4();
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      res.status(409).send({
        message: "User already exist!!",
      });
    } else {
      let encryptedPassword = await bcrypt.hash(password, 10);
      if (email) {
        await prisma.user.create({
          data: {
            id,
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: "USER",
          },
        });
      }
      res.json("User registered successfully!!");
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const safeUser = { ...user };
      delete safeUser.password;
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY
      );
      res.json([{ ...safeUser, token }]);
    } else
      res.status(400).send({
        message: "Email Or Password does't match!!",
      });
  } catch (err) {
    console.log(err.message);
  }
};
