'use strict';

const compose = require('koa-compose');
const debug = require('debug')('egg-socket.io:lib:connectionMiddlewareInit.js');
const http = require('http');
const util = require('./util');

module.exports = (app, socket, next, connectionMiddlewares) => {
  const composed = compose([ ...connectionMiddlewares, async function() {
    debug('=========>>>> The [1] next for connection middleware');
    next();
    // after socket emit disconnect, resume middlewares
    await new Promise(function onDisconnect(resolve) {
      socket.once('disconnect', reason => {
        debug('socket disconnect by %s', reason);
        resolve(reason);
      });
    });
  } ]);

  const request = socket.request;
  request.socket = socket;
  const ctx = app.createContext(request, new http.ServerResponse(request));
  util.delegateSocket(ctx);

  composed(ctx)
    .then(function() {
      debug('=========>>>> The [2] next for connection middleware');
      next();
    }) // next socket io middleware
    .catch(e => {
      e.message = '[egg-socket.io] connection middleware execute error: ' + e.message;
      app.coreLogger.error(e);
    });
};
