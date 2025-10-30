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
      // Match previous array response shape and chapter key aliases
      if (!course) return res.json([]);
      const mapped = {
        id: course.id,
        heading: course.heading,
        description: course.description,
        image_url: course.image_url,
        category: course.category,
        chapters: (course.chapters || []).map((c) => ({
          chapter_id: c.id,
          course_id: c.course_id,
          chapter_description: c.description,
          chapter_content: c.content,
          chapter_title: c.title,
        })),
      };
      res.json([mapped]);
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
