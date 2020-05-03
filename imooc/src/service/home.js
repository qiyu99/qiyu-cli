const User = require('../model/userModel')

module.exports = {
  login: async (us, pwd) => {
    if (!us || !pwd) {
      return { err: -1, msg: '参数错误' }
    }
    User.find({ us, pwd })
      .then((data) => {
        if (data.length > 0) {
          return { err: 0, msg: '登陆成功' }
        } else {
          return { err: -2, msg: '用户名或密码不正确' }
        }
      })
      .catch((err) => {
        return { err: -1, data: {err}, msg: '内部错误' }
      })
  },
}
