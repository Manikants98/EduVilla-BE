import express from "express";
import cors from "cors";
import pool from "./db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import auth from "./auth.js";
import jwt_decode from "jwt-decode";
import nodemailer from "nodemailer";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;
const corsOption = { origin: process.env.URL || "*" };

app.use(cors(corsOption));
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT || 3000}`);
});

//Node mailer

app.get("/", (req, res) => {
  res.send("Edu Villa API");
});
app.post("/chapters", async (req, res) => {
  try {
    const { course_id, title, description, content } = req.body;
    const id = uuidv4();
    if (course_id && title && description && content) {
      await pool.query(
        "Insert into chapters (course_id, id, title, description, content) values($1, $2, $3, $4, $5)",
        [course_id, id, title, description, content]
      );
      res.status(200).send({
        message: `${title} Added Successfully`,
        data: { ...req.body, id },
      });
    } else res.status(400).send({ message: "All fields are required." });
  } catch (err) {
    console.log(err.message);
  }
});
app.delete("/chapters", async (req, res) => {
  try {
    const { chapter_id } = req.query;
    if (!chapter_id)
      res.status(400).send({ message: "Please provide chapter_id." });
    const { rows } = await pool.query(
      `Select title from chapters where id=$1`,
      [chapter_id]
    );

    await pool.query(
      `DELETE FROM chapters
      WHERE id = $1`,
      [chapter_id]
    );

    res.status(200).send({
      message: `${rows[0].title} Deleted Successfully`,
    });
  } catch (err) {
    console.log(err.message);
  }
});

//register a user
app.post("/register", async (req, res) => {
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

    console.log(req.body);
  } catch (err) {
    console.log(err.message);
  }
});

//Create a course
app.post("/create-course", async (req, res) => {
  try {
    const { heading, description, image_url, category } = req.body;
    const id = uuidv4();
    await pool.query(
      "INSERT INTO courses (id,heading,description,image_url,category) VALUES($1,$2,$3,$4,$5)",
      [id, heading, description, image_url, category]
    );
    res.json("Course created successfully!!");
    console.log(req.body);
  } catch (err) {
    console.log(err.message);
  }
});

//get all course
app.get("/courses", async (req, res) => {
  try {
    const id = req.query.id;
    const { rows } = id
      ? await pool.query(
          `select *,(select json_agg(json_build_object(
            'chapter_id', id,
            'course_id', course_id,
            'chapter_description', description,
            'chapter_content', content,
            'chapter_title', title
                               )) from chapters where course_id=$1) as chapters from courses  where id=$1`,
          [id]
        )
      : await pool.query("SELECT * FROM  courses");
    res.json(rows);
    console.log(req.query.id);
  } catch (err) {
    console.log(err.message);
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { rows } = await pool.query(
      "SELECT id, email, name, gender, dob, city, state, zipcode, country,phone,password FROM  users WHERE  email=$1",
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
    console.log(rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get users
app.get("/users", async (req, res) => {
  try {
    const id = req.query.id;
    const { rows } = id
      ? await pool.query(
          "SELECT id, email, name, gender, dob, city, state, zipcode, country,phone,profile_url FROM  users where id=$1",
          [id]
        )
      : await pool.query(
          "SELECT id, email, name, gender, dob, city, state, zipcode, country,phone,password,profile_url FROM  users"
        );
    res.json(rows);
    console.log(req.query.id);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/user", auth, async (req, res) => {
  try {
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }
    const { id } = jwt_decode(token);

    console.log(jwt_decode(token));

    const { rows } = await pool.query(
      "SELECT id, email, name, gender, dob, city, state, zipcode, country,phone,profile_url,role FROM  users where id=$1",
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/update-profile", async (req, res) => {
  try {
    const {
      id,
      email,
      name,
      gender,
      dob,
      city,
      state,
      zipcode,
      country,
      phone,
      profile_url,
    } = req.body;

    const data = await pool.query(
      "UPDATE users SET email=$1,name=$2,gender=$3,dob=$4,city=$5,state=$6,zipcode=$7,country=$8,phone=$9,profile_url=$10 WHERE id=$11",
      [
        email,
        name,
        gender,
        dob,
        city,
        state,
        zipcode,
        country,
        phone,
        profile_url,
        id,
      ]
    );
    if (data) {
      const { rows } = await pool.query(
        "SELECT id, email, name, gender, dob, city, state, zipcode, country,phone,profile_url  FROM users WHERE id=$1",
        [id]
      );
      res.json(rows);
    }
    console.log(data);
  } catch (err) {
    console.log(err.message);
  }
});

//Contact api
app.post("/contact-us", async (req, res) => {
  try {
    const { email, name, message } = req.body;

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: "eduvilla.org@gmail.com",
        pass: "jqonbwejnyblsztv",
      },
    });

    var mailOptions = {
      from: "eduvilla.org@gmail.com",
      to: "abhi9936413991@gmail.com,dadzheromani@gmail.com",
      subject: name + " - Sent a message",
      html: `<h2>Edu-Villa Team,</h2><br /><h3 style="font-size:17px;">We have received a message from ${name} (${email})</h3></br><div style="font-size:18px;"><span style="font-weight:600;">Message from ${name} : </span> ${message}</div>`,
    };

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        console.log(error);
        res.status(404).send("Error Unable to send mail");
      } else {
        res.status(200).send("Mail sent");
      }
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/delete-courses", async (req, res) => {
  try {
    const id = req.query.id;
    const { rows } = id
      ? await pool.query("delete from courses where id=$1", [id])
      : await pool.query("delete from courses");
    if (id) {
      res.json("Course deleted");
    } else {
      res.json("All Course deleted");
    }

    console.log(req.query.id);
  } catch (err) {
    console.log(err.message);
  }
});
