'use strict';

module.exports = app => {
  return async function (ctx, next) {
    // we can't send cookie in ioc
    ctx.header.cookie = ctx.query.cookie;

    next();
  };
};
