import prisma from "../db.js";
import jwt_decode from "jwt-decode";

export const users = async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          gender: true,
          dob: true,
          city: true,
          state: true,
          zipcode: true,
          country: true,
          phone: true,
          profile_url: true,
        },
      });
      res.json(user ? [user] : []);
    } else {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          gender: true,
          dob: true,
          city: true,
          state: true,
          zipcode: true,
          country: true,
          phone: true,
          password: true,
          profile_url: true,
        },
      });
      res.json(users);
    }
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

    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        dob: true,
        city: true,
        state: true,
        zipcode: true,
        country: true,
        phone: true,
        profile_url: true,
        role: true,
      },
    });
    res.json(userData ? [userData] : []);
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

    const existing = await prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        name: true,
        gender: true,
        dob: true,
        city: true,
        state: true,
        zipcode: true,
        country: true,
        phone: true,
        profile_url: true,
      },
    });

    if (existing) {
      await prisma.user.update({
        where: { id },
        data: {
          email: email ?? existing.email,
          name: name ?? existing.name,
          gender: gender ?? existing.gender,
          dob: dob ?? existing.dob,
          city: city ?? existing.city,
          state: state ?? existing.state,
          zipcode: zipcode ?? existing.zipcode,
          country: country ?? existing.country,
          phone: phone ?? existing.phone,
          profile_url: profile_url ?? existing.profile_url,
        },
      });

      const updated = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          gender: true,
          dob: true,
          city: true,
          state: true,
          zipcode: true,
          country: true,
          phone: true,
          profile_url: true,
        },
      });
      res.json(updated ? [updated] : []);
    }
  } catch (err) {
    console.log(err.message);
  }
};
