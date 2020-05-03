const Router = require('koa-router')
const router = new Router()

module.exports = (app) => {
  router.get('/', app.controller.home.index)
  router.post('/login', app.controller.home.login)

  app.use(router.routes()).use(router.allowedMethods())
}
