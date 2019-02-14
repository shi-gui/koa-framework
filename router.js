const router = require('koa-router')();
const controller = require('./controller/controller.js');

router.get('/', controller.Index);
module.exports = router;