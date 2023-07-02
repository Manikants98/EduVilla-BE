import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

export const courses = async (req, res) => {
  try {
    const id = req.query.id;
    const { rows } = id
      ? await pool.query(
          `select *,(select json_agg(json_build_object(
              'chapter_id', id,
              'course_id', course_id,
              'chapter_description', description,
              'chapter_content', content,
              'chapter_title', title )) from chapters where course_id=$1) as chapters from courses where id=$1`,
          [id]
        )
      : await pool.query("SELECT * FROM  courses");
    res.json(rows);
  } catch (err) {
    console.log(err.message);
  }
};

export const createCourse = async (req, res) => {
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
};
