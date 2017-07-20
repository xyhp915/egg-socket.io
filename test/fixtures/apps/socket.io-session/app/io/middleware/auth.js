const fs = require('fs');

module.exports = app => {
  if (fs.existsSync(app.config.disconnectFile)) {
    fs.unlinkSync(app.config.disconnectFile);
  }
  return async function (ctx, next) {
    if (!ctx.session.user) {
      console.log('===============EMIT FORBIDDEN+++++ EVENT')
      return ctx.socket.emit('forbidden');
    }

    ctx.emit('join', app.config.disconnectFile);

    console.log('=============== BEFORE RELEASE SOMETHING ++++');

    await next();

    console.log('=============== END RELEASE SOMETHING ++++');
    fs.writeFile(app.config.disconnectFile, 'true');
  };
};
