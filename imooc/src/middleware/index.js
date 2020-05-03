/**
 * middleware/index.js 用来集中所有中间件
 */
const path = require('path')
const ip = require('ip')
const miRule = require('./mi-rule')
const miSend = require('./mi-send')
const miLog = require('./mi-log')
const bodyParser = require('koa-bodyparser')
const staticFiles = require('koa-static')
const nunjucks = require('koa-nunjucks-2')

module.exports = (app) => {
  /**
   * miRule 并非中间件，其只在项目启动时执行一次，
   * 在应用启动时，读取指定目录下的js文件，以文件名作为属性名，
   * 挂载到实例对象app上，然后把文件中的接口函数扩展到文件对象上。
   * 下面就将controller 和 service 挂载到 app 实例上
   */
  miRule({
    app,
    rules: [
      {
        folder: path.join(__dirname, '../controller'),
        name: 'controller',
      },
      {
        folder: path.join(__dirname, '../service'),
        name: 'service',
      },
    ],
  })

  app.use(staticFiles(path.resolve(__dirname, '../public')))
  app.use(
    nunjucks({
      ext: 'html',
      path: path.join(__dirname, '../views'),
      nunjucksConfig: {
        trimBlocks: true, // 开启转义，防止Xss攻击
      },
    })
  )
  app.use(bodyParser())
  app.use(miSend())
  app.use(
    miLog({
      env: app.env,
      projectName: 'koa2-tutorial',
      appLogLevel: 'debug',
      dir: 'logs',
      serverIp: ip.address(),
    })
  )
}
