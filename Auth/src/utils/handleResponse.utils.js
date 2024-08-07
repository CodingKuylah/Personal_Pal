export const handleResponse = (res, data, statusCode, message) => {
  res.status(statusCode).json({ message, data });
};
