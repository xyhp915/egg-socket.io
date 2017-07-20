'use strict';

const compose = require('koa-compose');
const debug = require('debug')('egg-socket.io:lib:packetMiddlewareInit.js');

const http = require('http');

const Emitter = require('events').EventEmitter;
const util = require('./util');

const RouterConfigSymbol = Symbol.for('EGG-SOCKET.IO#ROUTERCONFIG');
const CtxEventSymbol = Symbol.for('EGG-SOCKET.IO#CTX-EVENT');

module.exports = (app, socket, packet, next, packetMiddlewares, nsp) => {
  const request = socket.request;
  request.socket = socket;
  const ctx = app.createContext(request, new http.ServerResponse(request));
  ctx.packet = packet;
  ctx[CtxEventSymbol] = new Emitter();
  util.delegateSocket(ctx);
  const composed = compose([ ...packetMiddlewares, async function routeHandler() {
    packet.push(ctx);
    next();
    const eventName = packet[0];
    const routerMap = nsp[RouterConfigSymbol];
    if (routerMap && routerMap.has(eventName)) {
      debug('[egg-socket.io] wait controller finished!');
      // after controller execute finished, resume middlewares
      await new Promise(function onFinished(resolve, reject) {
        ctx[CtxEventSymbol].on('finished', e => {
          debug('[egg-socket.io] controller execute finished, resume middlewares');
          (e && e instanceof Error) ? reject(e) : resolve(e);
        });
      });
    }
  } ]);

  composed(ctx)
  .catch(e => {
    e.message = '[egg-socket.io] packet middleware execute error: ' + e.message;
    app.coreLogger.error(e);
  });
};
