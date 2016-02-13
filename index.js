'use strict';
/* eslint-disable no-console */

const app = require('./app');

app.config = require('./config');

const httpServer = app.listen(app.config.port, function listen() {
  const host = this.address().address;
  const port = this.address().port;

  console.log(`Mock Yeah listening at http://${host}:${port}`);
});

module.exports = app.RouteManager;

module.exports.config = app.config;

module.exports.close = httpServer.close.bind(httpServer, function callback() {
  console.log('Mock Yeah server closed.');
});
