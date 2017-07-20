module.exports = app => {
  return async function (ctx, next) {
    ctx.socket.on('anEventNotRegisterInTheRouter',()=> {

    })

    await next()
  }
}