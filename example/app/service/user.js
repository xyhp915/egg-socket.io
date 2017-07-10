'use strict';

module.exports = app => {
  class User extends app.Service {
    * say() {
      return 'Helle Man!';
    }

    async say2() {
      return Promise.resolve('hello, async');
    }
  }
  return User;
};
