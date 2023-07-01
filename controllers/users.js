import pool from "../db.js";
import jwt_decode from "jwt-decode";

export const users = async (req, res) => {
  try {
    const id = req.query.id;
    const { rows } = id
      ? await pool.query(
          "SELECT id, email, name, gender, dob, city, state, zipcode, country,phone,profile_url FROM  users where id=$1",
          [id]
        )
      : await pool.query(
          "SELECT id, email, name, gender, dob, city, state, zipcode, country,phone,password,profile_url FROM users"
        );
    res.json(rows);
  } catch (err) {
    console.log(err.message);
  }
};

export const user = async (req, res) => {
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
};
export const updateProfile = async (req, res) => {
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

    const { rows } = await pool.query(
      "SELECT  email, name, gender, dob, city, state, zipcode, country,phone FROM  users WHERE  id=$1",
      [id]
    );

    if (rows.length !== 0) {
      const data = await pool.query(
        "UPDATE users SET email=$1,name=$2,gender=$3,dob=$4,city=$5,state=$6,zipcode=$7,country=$8,phone=$9,profile_url=$10 WHERE id=$11",
        [
          email || rows[0].email,
          name || rows[0].name,
          gender || rows[0].gender,
          dob || rows[0].dob,
          city || rows[0].city,
          state || rows[0].state,
          zipcode || rows[0].zipcode,
          country || rows[0].country,
          phone || rows[0].phone,
          profile_url || rows[0].profile_url,
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
    }

    console.log(data);
  } catch (err) {
    console.log(err.message);
  }
};
