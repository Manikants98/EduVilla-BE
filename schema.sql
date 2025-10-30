-- PostgreSQL schema for EduVilla
-- Creates database and all tables used by the app

-- 1) Create database (optional on managed services like ElephantSQL)
-- Run this only if you have privileges to create databases
-- CREATE DATABASE eduvilla;
-- \c eduvilla

-- 2) Enable extensions if available (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3) Tables

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    gender TEXT,
    dob DATE,
    city TEXT,
    state TEXT,
    zipcode TEXT,
    country TEXT,
    phone TEXT,
    profile_url TEXT
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY,
    heading TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT
);

-- Chapters
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT
);

CREATE INDEX IF NOT EXISTS idx_chapters_course_id ON chapters(course_id);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    comment TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_course_id ON comments(course_id);
CREATE INDEX IF NOT EXISTS idx_comments_chapter_id ON comments(chapter_id);


