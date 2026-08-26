export function notFound(req, res) {
  res.status(404).json({message: `Route not found: ${req.method} ${req.originalUrl}`});
}

export function errorHandler(error, req, res, next) {
  const status = error.statusCode || (error.name === "ValidationError" || error.name === "CastError" ? 400 : 500);
  res.status(status).json({message: error.message || "Server error"});
}
