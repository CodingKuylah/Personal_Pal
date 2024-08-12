export const handleFailedResponse = (res, message, status_code = 404) => {
  res.status(status_code).json({
    success: false,
    statusCode: status_code,
    message: message,
    timestamp: new Date().toISOString(),
  });
};
