export const handleErrorResponse = (res, error) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const errorMessage = error.message || "Internal Server Error";
  const errorDetails = error.details || null;

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: errorMessage,
    timestamp: new Date().toISOString(),
    error: {
      name: error.name || "Error",
      details: errorDetails,
    },
  });
};
