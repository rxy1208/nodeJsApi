'use strict'

var mysql = require('mysql');
var connect = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: 'root',
    password: 'root',
    database: "vuecmsshop",
    //socketPath:"/Applications/MAMP/tmp/mysql/mysql.sock"
});

connect.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('数据库连接成功');
});

var successState = 0 // 表示成功
var fialState = 1 // 表示失败
// 七牛云存储对象域名
var mydomain = "http://phvbk3pna.bkt.clouddn.com/";

//定义控制器，下面都是控制器的方法
var controller = {};

//1. 获取首页轮播图数据
controller.getlunbo = (req, res) => {
    var resObj = {
        status: successState,
        message: [{
            url: 'http://www.itcast.cn/subject/phoneweb/index.html',
            img: `${mydomain}vuelogobanner1.jpg`
        }, {
            url: 'http://www.itcast.cn/subject/webzly/index.shtml',
            img: `${mydomain}vuelogobanner2.jpg`
        }]
    }
    res.end(JSON.stringify(resObj))
}


// 2. 获取图片新闻资讯列表
controller.getnewslist = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }
    var sql = " SELECT id,title,add_time,left(zhaiyao,25) as zhaiyao,click,concat('" + mydomain + "',img_url) as img_url FROM dt_article where img_url > '' and channel_id = 6 limit 0,10 "
    console.log('获取图文资讯sql语句：============>', sql)
    connect.query(sql, (err, datas) => {
        // 4.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return;
        }

        resObj.message = datas
        res.end(JSON.stringify(resObj))
    })
}

// 2.0 根据资讯id获取资讯详细内容
controller.getnew = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    // 1.0 获取参数值
    var newid = req.params.newid

    // 2.0 执行查询操作
    var sql = 'select id,title,click,add_time,content,concat("' + mydomain + '",img_url) as img_url from dt_article  where id=' + newid
    console.log('获取资讯明细sql===>', sql)
    connect.query(sql, (err, data) => {
        // 3.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 4.0 获取数据成功
        resObj.message = data
        res.end(JSON.stringify(resObj))
    })
}

// 3.0 商品
controller.getgoods = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }
    var pageindex = req.query.pageindex
    if (!pageindex) {
        pageindex = 1;
    }
    var pagesize = 10
    var skipcount = (pageindex - 1) * pagesize


    var sql = `SELECT a.id,a.title,a.add_time,left(a.zhaiyao,25) as zhaiyao,a.click,concat('${mydomain}',a.img_url) as img_url,b.sell_price,b.market_price,b.stock_quantity FROM dt_article as a,dt_article_attribute_value b where a.id = b.article_id and a.channel_id = 7 limit ${skipcount},${pagesize} `
    console.log('获取图文资讯sql语句：============>', sql)
    connect.query(sql, (err, datas) => {
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        //获取数据成功
        resObj.message = datas
        res.end(JSON.stringify(resObj))
    })
}

/*
3.0.1 获取商品详情页面数据
-- 获取商品详情页标题，图文介绍信息等
SELECT * FROM dt_article da WHERE da.channel_id = 7 AND da.title LIKE '%新科%';
-- 获取商品详情页中的滚动图片
select * FROM dt_article_albums daa WHERE daa.article_id = 101;

-- 获取商品参数区域信息
SELECT daav.goods_no,daav.stock_quantity FROM dt_article_attribute_value daav  WHERE daav.article_id =101;

-- 商品品论
select * from dt_article_comment dac WHERE dac.article_id=101
 */

// 商品图文描述
controller.getgooddesc = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    var id = req.params.id;
    var sql = ` SELECT title,content FROM dt_article da WHERE da.id = ${id} `
    console.log('获取商品图文描述sql语句：============>', sql)
    connect.query(sql, (err, datas) => {
        // 4.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 5.0 获取数据成功
        resObj.message = datas
        res.end(JSON.stringify(resObj))
    })
}

// 获取商品标题，价格，参数区数据
// getgoodsinfo
controller.getgoodsinfo = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    var id = req.params.id;
    var sql = ` SELECT da.id,da.title,da.add_time,daa.goods_no,daa.stock_quantity,daa.market_price,daa.sell_price FROM dt_article da , dt_article_attribute_value daa 
        WHERE  da.id = daa.article_id and da.id = ${id} `
    console.log('获取商品获取商品标题，价格，参数区数据sql语句：============>', sql)
    connect.query(sql, (err, datas, fields) => {
        // 4.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 5.0 获取数据成功
        resObj.message = datas
        res.end(JSON.stringify(resObj))
    })
}

//获取购物车列表数据
controller.getshopcarlist = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    // 1.0 获取参数值
    var ids = req.params.ids

    // 2.0 执行查询操作
    var sql = `
          SELECT count(distinct tb1.id) as cou, tb1.* FROM (
        SELECT  da.id,da.title,daa.sell_price,concat('${mydomain}',alb.thumb_path) as thumb_path
          FROM dt_article da 
          LEFT JOIN dt_article_attribute_value daa ON (da.id = daa.article_id)
          LEFT JOIN dt_article_albums alb ON (da.id = alb.article_id)
        WHERE  da.id IN(${ids}) ) AS tb1 GROUP BY tb1.id
  `

    console.log('获取购物车列表sql===>', sql)
    connect.query(sql, (err, data) => {
        // 3.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 4.0 获取数据成功
        resObj.message = data
        res.end(JSON.stringify(resObj))
    })
}


// 4.0 图片分享
controller.getCatImages = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    var cateid = req.params.cateid - 0

    var sql = ' select id,title,concat("' + mydomain + '",img_url) as img_url,zhaiyao from dt_article where channel_id = 9 and category_id=' + cateid

    if (cateid <= 0) {
        sql = ' select id,title,concat("' + mydomain + '",img_url) as img_url,zhaiyao from dt_article where channel_id = 9'
    }

    console.log('获取图片分享sql语句：============>', sql)
    connect.query(sql, (err, datas) => {
        // 4.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 5.0 获取数据成功
        resObj.message = datas
        res.end(JSON.stringify(resObj))
    })
}


// 4.0.1 根据商品id或图片id获取图片缩略图
controller.getthumbimages = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    // 1.0 获取路由参数值
    var newid = req.params.imgid

    // 2.0 执行查询操作
    var sql = 'select concat("' + mydomain + '",thumb_path)  as src  from dt_article_albums where article_id =' + newid;

    console.log('获取图片分享明细中缩略图sql===>', sql)
    connect.query(sql, (err, data) => {
        // 3.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 4.0 获取数据成功
        resObj.message = data
        res.end(JSON.stringify(resObj))
    })
}


// 4.0.1 根据id获取图片详细内容
controller.getimageInfo = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    // 1.0 获取参数值
    var newid = req.params.imgid

    // 2.0 执行查询操作
    var sql = `select id,title,click,add_time,content from dt_article where id=${newid}`

    console.log('获取图片分享明细sql===>', sql)
    connect.query(sql, (err, datas) => {
        // 3.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 4.0 获取数据成功
        resObj.message = datas
        res.end(JSON.stringify(resObj))
    })
}

// 5.0 获取图片分享分类
controller.getimgcategory = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    // 3.0 利用orm发送sql语句查询出来分页数据即可
    /*

     */
    var sql = ' select title,id from dt_article_category where channel_id = 9 '
    console.log('获取图片分享分类sql语句：============>', sql)
    connect.query(sql, (err, datas) => {
        // 4.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 5.0 获取数据成功
        resObj.message = datas
        res.end(JSON.stringify(resObj))
    })
}

//6.0 获取评论信息
controller.getcomments = (req, res) => {
    // 代表返回的数据结构
    var resObj = { status: successState, message: '' }

    // 1.0 获取参数值
    var artid = req.params.artid
    var pageindex = req.query.pageindex
    // var pagesize = 10;
    var pagesize = 3;
    var skipCount = (pageindex - 1) * pagesize

    // 2.0 执行查询操作
    var sql = `select user_name,add_time,content from dt_article_comment where article_id = ${artid} order by add_time desc limit ${skipCount},${pagesize}`

    console.log('获取评论sql===>', sql)
    connect.query(sql, (err, data) => {
        // 3.0 判断是否异常
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }

        // 4.0 获取数据成功
        resObj.message = data
        res.end(JSON.stringify(resObj))
    })
}


//7.0 提交评论数据
controller.postcomment = (req, res) => {
    // 返回的数据结构
    var resObj = { status: successState, message: '' }

    var artid = req.params.artid
    var content = req.body.content;

    var sql = `insert into  dt_article_comment(channel_id,article_id,parent_id,user_id,user_name,user_ip,
                            content,is_lock,add_time,is_reply,reply_content,reply_time)
              values (7,${artid},0,0,'匿名用户','127.0.0.1','${content}',0,NOW(),0,'',NOW())`

    console.log('post提交评论sql===>', sql)
    connect.query(sql, (err, data) => {
        if (err) {
            resObj.status = fialState
            resObj.message = err.message
            res.end(JSON.stringify(resObj))
            return
        }
        resObj.message = '评论提交成功'
        res.end(JSON.stringify(resObj))
    })


}


//暴露出去
module.exports = controller;