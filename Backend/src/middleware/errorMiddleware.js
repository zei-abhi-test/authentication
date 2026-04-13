import AppError from "../AppError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let error = err;

  if (err.name === "ValidationError") {
    error = new AppError("Invalid input data", 400);
  }

  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Something went wrong!";

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;