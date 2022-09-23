import jwt from "jsonwebtoken";

// checks if token is valid
export const verifyToken = (request, response, next) => {
  const authHeader = request.headers["authorization"] || request.headers["Authorization"];
  
  if (!authHeader) return response.status(401).json("You are not authenticated.");

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return response.status(403).json("Token is not valid.");
    
    request.user = user;
    next();
  });
};

// check if the user is the account holder
export const verifyUser = (request, response, next) => {
  verifyToken(request, response, () => {
    if (request.user.id === request.params.id) {
      next(); // if user is correct proceed
    } else {
      response
        .status(403)
        .json("You do not have authorisation to execute this action.");
    }
  });
};

