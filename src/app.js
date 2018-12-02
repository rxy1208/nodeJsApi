'use strict'

var express = require('express');
var app = express();

//获取post请求参数
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

//将所有api的请求响应content-type设置为application/json
app.all('/api/*', (req, res, next) => {
    //设置允许跨域响应报文头
    //设置跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    next();
});


// //2.0 设置路由规则
var router = require('./router.js');

app.use('/', router);


app.listen(3001, () => {
    console.log('api服务已启动, 请访问：http://127.0.0.1:3001');
});