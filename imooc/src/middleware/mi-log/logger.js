const log4js = require('log4js');
const access = require('./access');
const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark'];


const baseInfo = {
    appLogLevel: 'debug',
    dir: 'logs',
    env: 'dev',
    projectName: 'koa2-template',
    serverIp: '0.0.0.0'
}
// const { env, appLogLevel, dir } = baseInfo;

module.exports = (options) => {
    const contextLogger = {};
    const appenders = {};
    const opts = Object.assign({}, baseInfo, options || {});
    const { env, appLogLevel, dir, serverIp, projectName } = opts;
    const commonInfo = { projectName, serverIp };
    appenders.cheese = {
        type: 'dateFile',
        filename: `${dir}/task`,
        pattern: '-yyyy-mm-dd.log',
        alwaysIncludePattern: true
    }
    if (env === 'dev' || env === 'development') {
        // 开发环境
        appenders.out = {
            type: 'console'
        };
    }
    let config = {
        appenders,
        categories: {
            default: {
                appenders: Object.keys(appenders),
                level: appLogLevel
            }
        }
    };
    log4js.configure(config);
    const logger = log4js.getLogger('cheese');
    return async (ctx, next) => {
        const start = Date.now();
        methods.forEach((method, i) => {
            contextLogger[method] = (message) => {
                logger[method](access(ctx, message, commonInfo));
            }
        });
        /**
         * 将按照级别记录日志的快捷方法挂载到请求上下文ctx的log对象中，
         * 在需要记录日志时，可通过上下文ctx直接调用
         * 例如：ctx.log.error('error message');
         */ 
        ctx.log = contextLogger;
        await next();
        const end = Date.now();
        const responseTime = end - start;
        logger.info(access(ctx, {
            responseTime: `响应时间为${responseTime/1000}s`
        }, commonInfo));
    }
}