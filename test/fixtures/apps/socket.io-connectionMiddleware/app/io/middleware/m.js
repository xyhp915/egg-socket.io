'use strict';

const fs = require('fs');

module.exports = app => {
  if (fs.existsSync(app.config.disconnectFile)) {
    fs.unlinkSync(app.config.disconnectFile);
  }
  return async function (ctx, next) {
    ctx.emit('connected', app.config.disconnectFile);
    await next();
    fs.writeFile(app.config.disconnectFile, 'true');
  };
};
