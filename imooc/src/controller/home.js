// const HomeService = require('../service/home');

module.exports = {
  index: async (ctx, next) => {
    ctx.response.body = '<h1>index page</h1>'
  },

  login: async (ctx, next) => {
    const { app } = ctx
    let { name, password } = ctx.request.body
    let data = await app.service.home.login(name, password)
    ctx.response.body = data
  },

  register: async (ctx, next) => {
    const { app } = ctx
    let params = ctx.request.body
    let name = params.name
    let password = params.password
    let res = await app.service.home.register(name, password)
    if (res.status == '-1') {
      await ctx.render('home/login', res.data)
    } else {
      ctx.state.title = '个人中心'
      await ctx.render('home/success', res.data)
    }
  },
}
