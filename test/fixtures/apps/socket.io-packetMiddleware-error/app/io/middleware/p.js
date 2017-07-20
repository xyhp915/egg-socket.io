'use strict';

module.exports = app => {
  return async function (ctx, next) {
    throw new Error('packetMiddleware Error!');

    await next();
  };
};
