const errorHandlerMiddleware = (err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
};

export default errorHandlerMiddleware;