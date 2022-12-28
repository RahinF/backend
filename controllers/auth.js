import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (_id) =>
  jwt.sign({ id: _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });

const generateRefreshToken = (_id) =>
  jwt.sign({ id: _id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

const setCookie = (response, refreshToken) => {
  response.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "none",
    secure: true, // true for https
  });
};

export const login = async (request, response, next) => {
  const { email, password } = request.body;
  if (!email || !password)
    return response.status(400).json("Email and password are required.");

  try {
    // check if user has an account
    let user = await User.findOne({ email });
    if (!user)
      return response
        .status(401)
        .json("The email or password you have entered is invalid.");

    const { _id, password: hashedPassword, image, subscriptions } = user;

    const passwordIsCorrect = await bcrypt.compare(password, hashedPassword);
    if (!passwordIsCorrect)
      return response
        .status(401)
        .json("The email or password you have entered is invalid.");

    const accessToken = generateAccessToken(_id);
    const refreshToken = generateRefreshToken(_id);

    // store refresh token in the database
    await user.updateOne({ refreshToken });

    // store refreshToken in a httpOnly cookie
    setCookie(response, refreshToken);

    response.status(200).json({
      user: {
        id: _id,
        image,
        subscriptions,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (request, response, next) => {
  const { name, email, password } = request.body;
  if (!email || !password)
    return response.status(400).json("Email and password are required.");

  try {
    // check if email is already in use
    const duplicate = await User.findOne({ email });
    if (duplicate)
      return response.status(409).json("The email address is already in use.");

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { _id, image, subscriptions } = user;

    // create tokens
    const accessToken = generateAccessToken(_id);
    const refreshToken = generateRefreshToken(_id);

    // store refreshToken in a httpOnly cookie
    setCookie(response, refreshToken);

    // store refresh token in the database
    await user.updateOne({ refreshToken });

    response.status(201).json({
      user: { id: _id, image, subscriptions },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (request, response) => {
  const cookies = request.cookies;

  if (!cookies?.jwt) return response.status(401).json("Unauthorized");

  const refreshToken = cookies.jwt;

  // find user with this refresh token
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) return response.status(403).json("Forbidden");

  // refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      // if jwt is tampered with return forbidden status
      if (error || !foundUser._id.equals(decoded.id))
        return response.status(403).json("Forbidden");

      // create new access token
      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      // sends the id and access token (used in login persistance)
      response.json({
        user: {
          id: decoded.id,
          image: foundUser.image,
          subscriptions: foundUser.subscriptions,
        }, 
        accessToken,
      });
    }
  );
};

export const logout = async (request, response) => {
  // On the cliend delete jwt access token from memory!

  const cookies = request.cookies;

  if (!cookies?.jwt) return response.sendStatus(204); // no content

  const refreshToken = cookies.jwt;

  // find user with this refresh token
  const foundUser = await User.findOne({ refreshToken });

  // clear cookie
  response.clearCookie("jwt");

  // clear cookie if user is not found
  if (!foundUser) return response.sendStatus(204);

  // delete refresh token in database
  await foundUser.updateOne({ refreshToken: "" });

  response.sendStatus(204);
};
