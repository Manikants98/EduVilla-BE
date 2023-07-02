import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

export const addComments = async (req, res) => {
  try {
    const { course_id, chapter_id, name, comment } = req.body;
    const id = uuidv4();
    if (name && comment && course_id && chapter_id) {
      await pool.query(
        "INSERT INTO comments (id,course_id ,chapter_id, name, comment) VALUES ($1, $2, $3, $4, $5)",
        [id, course_id, chapter_id, name, comment]
      );
      res.status(201).send({ message: "Comment added successfully." });
    } else res.status(400).send({ message: "All fields are required." });
  } catch (err) {
    console.error(err);
  }
};

export const comments = async (req, res) => {
  try {
    const id = req.query.chapter_id;
    const { rows } = await pool.query(
      "SELECT * FROM comments where chapter_id=$1",
      [id]
    );
    res.send(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the comments." });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment_id = req.query.id;

    if (comment_id) {
      await pool.query("DELETE FROM comments WHERE id = $1", [comment_id]);
      res.status(200).send({ message: "Comment deleted successfully." });
    } else res.status(400).send({ message: "Please provide comment id" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the comment." });
  }
};
