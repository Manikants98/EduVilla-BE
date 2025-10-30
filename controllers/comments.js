import { v4 as uuidv4 } from "uuid";
import prisma from "../db.js";

export const addComments = async (req, res) => {
  try {
    const { course_id, chapter_id, name, comment } = req.body;
    const id = uuidv4();
    if (name && comment && course_id && chapter_id) {
      await prisma.comment.create({
        data: { id, course_id, chapter_id, name, comment },
      });
      res.status(201).send({ message: "Comment added successfully." });
    } else res.status(400).send({ message: "All fields are required." });
  } catch (err) {
    console.error(err);
  }
};

export const comments = async (req, res) => {
  try {
    const id = req.query.chapter_id;
    const rows = await prisma.comment.findMany({ where: { chapter_id: id } });
    const mapped = rows.map((r) => ({
      id: r.id,
      course_id: r.course_id,
      chapter_id: r.chapter_id,
      name: r.name,
      comment: r.comment,
      date: (r.created_at ?? new Date()).toISOString(),
    }));
    res.send(mapped);
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
      await prisma.comment.delete({ where: { id: comment_id } });
      res.status(200).send({ message: "Comment deleted successfully." });
    } else res.status(400).send({ message: "Please provide comment id" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the comment." });
  }
};
