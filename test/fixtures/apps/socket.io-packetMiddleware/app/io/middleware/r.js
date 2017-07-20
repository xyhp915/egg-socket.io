'use strict'

module.exports = app => {
  return async function (ctx, next) {
    await next();

    ctx.socket.emit('thisMessageMeansRelease', 'true');
  };
};
