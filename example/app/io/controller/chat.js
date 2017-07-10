'use strict';

module.exports = () => {
  return async function() {
    const message = this.args[0];
    console.log('chat :', message + ' : ' + process.pid);

    const say = await this.service.user.say2();
    // const say = yield this.service.user.say();

    // this.socket.emit('res', say);
    this.socket.emit('res', say);
  };
};
