import AppError from "./AppError.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === "ValidationError") {
    error = new AppError("Invalid input data", 400);
  }

  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Something went wrong!";

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;