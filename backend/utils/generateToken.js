import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const expiresIn = "1h";

  const token = jwt.sign({ id: userId }, secretKey, { expiresIn });
  return token;
};

export default generateToken;
