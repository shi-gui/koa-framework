const Koa = require('koa');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const views = require('koa-view');
const convert = require('koa-convert');
const staticCache = require('koa-static-cache');

const CONFIG = {
    key: "qingshudan",
    maxAge: 86400000,
    overwrite: false,
    httpOnly: false,
    signde: false,
    rolling: false
}

const app = new Koa();

app.keys = ['some secret hurr']

app.use(session(CONFIG, app));

app.use(bodyParser());

//静态文件服务
app.use(convert(staticCache(__dirname + '/public', {
    maxAge: 1 * 24 * 60 * 60
})));

app.use(views(__dirname + "/views"))

//路由
app.use(require('./router.js').routes());

app.listen(3000);
console.log("正在监听:3000端口");