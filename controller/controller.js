const moment = require('moment');
const db = require('../tools/mysql.js');

//首页
exports.Index = async(ctx, next) => {
    await ctx.render("index");
}

