import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";
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
    const { rowCount: isUserExist } = await pool.query(
      "select email from users where email=$1",
      [email.toLowerCase()]
    );

    if (isUserExist) {
      res.status(409).send({
        message: "User already exist!!",
      });
    } else {
      let encryptedPassword = await bcrypt.hash(password, 10);

      email &&
        (await pool.query(
          "INSERT INTO users (id,name,email,password,role) VALUES($1,$2,$3,$4,'USER')",
          [id, name, email.toLowerCase(), encryptedPassword]
        ));
      res.json("User registered successfully!!");
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { rows } = await pool.query(
      "SELECT id, email, name, gender, dob, city, state, zipcode, country,phone,password FROM users WHERE email=$1",
      [email.toLowerCase()]
    );

    if (
      rows.length !== 0 &&
      email.toLowerCase() === rows[0].email &&
      (await bcrypt.compare(password, rows[0].password))
    ) {
      delete rows[0].password;
      const token = jwt.sign(
        { id: rows[0].id, email: rows[0].email },
        process.env.JWT_SECRET_KEY
      );
      rows[0].token = token;
      res.json(rows);
    } else
      res.status(400).send({
        message: "Email Or Password does't match!!",
      });
  } catch (err) {
    console.log(err.message);
  }
};
