export const handleError = (res, error) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const errorMessage = error.message || "Internal Server Error";

  res.status(statusCode).json({ error: errorMessage });
};
