import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

export const addChapters = async (req, res) => {
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
};

export const deleteChapters = async (req, res) => {
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
};
