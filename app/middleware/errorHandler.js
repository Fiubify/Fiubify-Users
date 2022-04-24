const errorInterface = require('../errors/errorInterface');

function errorHandler(err, req, res, _next) {
  if (err instanceof errorInterface) {
    res.status(err.code).json(err.toJson());
    return;
  }

  res.status(500).json({ error: { msg: 'Internal error' } });
}

module.exports = errorHandler;
