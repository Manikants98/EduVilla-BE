import express from "express";
import { register, login } from "../controllers/authentication.js";
import { contact } from "../controllers/contact.js";
import { courses, createCourse } from "../controllers/courses.js";
import { updateProfile, user, users } from "../controllers/users.js";
import { addChapters, deleteChapters } from "../controllers/chapters.js";
import auth from "../controllers/auth.js";
import {
  addComments,
  comments,
  deleteComment,
} from "../controllers/comments.js";

const route = express.Router();
route.post("/register", register);
route.post("/login", login);
route.get("/users", users);
route.get("/profile", auth, user);
route.put("/profile", updateProfile);
route.post("/contact-us", contact);
route.post("/course", createCourse);
route.get("/courses", courses);
route.post("/chapters", addChapters);
route.delete("/chapters", deleteChapters);
route.post("/comments", addComments);
route.get("/comments", comments);
route.delete("/comments", deleteComment);

export default route;
