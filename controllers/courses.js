import { v4 as uuidv4 } from "uuid";
import prisma from "../db.js";

export const courses = async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      const course = await prisma.course.findUnique({
        where: { id },
        include: { chapters: true },
      });
      // Match previous array response shape
      res.json(course ? [course] : []);
    } else {
      const courses = await prisma.course.findMany();
      res.json(courses);
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const createCourse = async (req, res) => {
  try {
    const { heading, description, image_url, category } = req.body;
    const id = uuidv4();
    await prisma.course.create({
      data: { id, heading, description, image_url, category },
    });
    res.json("Course created successfully!!");
    console.log(req.body);
  } catch (err) {
    console.log(err.message);
  }
};
