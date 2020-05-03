const Koa = require('koa');
const app = new Koa();
const db = require('./src/db');
const router = require('./src/router');
const middleware = require('./src/middleware');

middleware(app);
router(app);

app.listen(3000, ()=>{
    console.log('server is running at http://localhost:3000');
})

app.on('error', (err, ctx) => {
    if (ctx && !ctx.headerSent && ctx.status < 500) {
        ctx.status = 500;
    };
    if (ctx && ctx.log && ctx.log.error) {
        if (!ctx.state.logged) {
            ctx.log.error(err.stack);
        };
    };
});
