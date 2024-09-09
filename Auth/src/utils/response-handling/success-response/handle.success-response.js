export const handleSuccessResponse = (
  res,
  data,
  status_code = 200,
  message,
) => {
  res.status(status_code).json({
    success: true,
    status_code: status_code,
    message: message,
    timestamp: new Date().toISOString(),
    data: data,
  });
};
