'use strict';

module.exports = app => {
  return async function (ctx, next) {
    throw new Error('connectionMiddleware Error!');
  };
};
