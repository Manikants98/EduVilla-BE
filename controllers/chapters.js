import { v4 as uuidv4 } from "uuid";
import prisma from "../db.js";

export const addChapters = async (req, res) => {
  try {
    const { course_id, title, description, content } = req.body;
    const id = uuidv4();
    if (course_id && title && description && content) {
      await prisma.chapter.create({
        data: { course_id, id, title, description, content },
      });
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
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapter_id },
      select: { title: true },
    });

    await prisma.chapter.delete({ where: { id: chapter_id } });

    res.status(200).send({
      message: `${chapter?.title ?? "Chapter"} Deleted Successfully`,
    });
  } catch (err) {
    console.log(err.message);
  }
};
