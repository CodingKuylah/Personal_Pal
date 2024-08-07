export const handleError = (res, error) => {
  console.error(error);

  const statusCode = res.statusCode || 500;
  const errorMessage = res.message || "Internal Server Error";

  res.status(statusCode).json({ error: errorMessage });
};
