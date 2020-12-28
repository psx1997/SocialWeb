const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const mysql = require("mysql")
const url = require('url');
const jwt = require('jsonwebtoken')
var cors = require("cors"); //  cnpm install cors

app.use(cors({
	origin: ['http://localhost:8080'],
	methods: ["GET", "POST"],
	alloweHeaders: ["Content-Type", "application/json;charset=utf-8;application/x-www-form-urlencoded;"]
}));


app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

//创建连接
const db = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "webmysql"
})
db.connect((err) => {
	if (err) throw err;
	console.log("连接成功");
})
app.listen(3000, () => {
	console.log("服务器开启在3000端口....");
})

var jsonWrite = function(res, ret) {
	if (typeof ret === 'undefined') {
		res.json({
			code: '1',
			msg: '操作失败'
		})
	} else {
		res.json(ret)
	}
}
// 查询用户信息
app.post('/login', (req, res) => {
	let sql = 'SELECT * FROM users WHERE username = ? AND password = ? '
	let params = req.body
	let username = params.username
	db.query(sql, [params.username, params.password], function(err, result) {
		if (err) {
			console.log(err);
		} else {
			// console.log(username)
			res.json({
				// 参数一:加密的对象 参数二:加密的规则 
				token:jwt.sign({username:username},'abcd',{
					expiresIn:"3000s"
				}),
				username:username,
				result,
				state:1,
				code:200
			})
		}
	})
})

//登录持久化验证接口
app.post('/validate',(req,res)=>{
	let token = req.headers.authorization;
	console.log(token);
	// 验证token,对token进行解码
	jwt.verify(token,'abcd',(err,decode)=>{
		if(err){
			res.json({
				msg:'用户未登录'
			})
		}else{
			res.json({
				token:jwt.sign({username:decode.username},'abcd',{
					expiresIn:"3000s"
				}),
				username:decode.username,
				msg:'已登录'
			})
		}
	})
})

// 增加用户接口
app.post('/addUser', (req, res) => {
	let sql = 'insert into users(username, password) values(?, ?)'
	let params = req.body
	db.query(sql, [params.username, params.password], function(err, result) {
		if (err) {
			console.log('添加失败' + err)
		}
		if (result) {
			jsonWrite(res, result)
			console.log(req.body)
		}
	})
})

//判断用户是否存在接口
app.post('/verifyUser',(req,res)=>{
	let sql = 'select count(*) as count from users where username=?'
	let params = req.body
	db.query(sql,[params.username],function(err,result){
		if (err) {
			console.log('查询失败' + err)
		}
		if (result) {
			jsonWrite(res, result)
		}
	})
})

// 查询栏目接口
app.get('/getContent',(req,res)=>{
	let sql = `select t1.id as id,t1.head as head,t2.sign as sign,t2.title as title,t2.text as text,t2.ask as ask,t2.img as img,t2.push as push from t_head as t1,t_content as t2 where t1.id = t2.id`;
	db.query(sql, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.json(result)
		}
	})
})

//查询用户内容接口
app.get('/getUser',(req,res)=>{
	let params = url.parse(req.url,true).query
	let str = JSON.stringify(params);
	str = JSON.parse(str);
	let sql = 'select * from users where username = ?'
	db.query(sql, [str.username],(err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.json(result)
		}
	})
})

//修改用户数据接口
app.post('/modify',(req,res)=>{
	let sql = `UPDATE users SET username = '${req.body.username}',job = 
	'${req.body.job}',sex = '${req.body.sex}',csrq = '${req.body.csrq}',
	region = '${req.body.region}',about = '${req.body.about}' WHERE id = '${req.body.id}'`;
	db.query(sql, function(err, result) {
		if (err) {
			console.log('修改失败' + err)
		}
		if (result) {
			jsonWrite(res, result)
		}
	})
})

//查询用户名称接口
app.get('/getName',(req,res)=>{
	let params = url.parse(req.url,true).query
	let str = JSON.stringify(params);
	str = JSON.parse(str);
	let sql = 'select username,sex from users where id = ?'
	db.query(sql, [str.id],(err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.json(result)
		}
	})
})

//查询日记内容接口
app.get('/getDiary',(req,res)=>{
	let params = url.parse(req.url,true).query
	let str = JSON.stringify(params);
	str = JSON.parse(str);
	let sql = `select t2.sign as sign,t2.id as id,t2.title as title,t2.address as address,t2.date as date from users as t1,t_diary as t2 where t1.id = t2.id and t2.id = ?`;
	db.query(sql, [str.id],(err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.json(result)
		}
	})
})

//删除日记内容接口
app.get('/removeDiary',(req,res)=>{
	let params = url.parse(req.url,true).query
	let str = JSON.stringify(params);
	str = JSON.parse(str);
	let sql = `delete from t_diary where sign = ?`
	db.query(sql, [str.sign],(err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.json(result)
		}
	})
})

//发布日记接口
app.post('/addDiary',(req,res)=>{
	let sql = 'insert into t_diary(id,title,address,date) values(?,?,?,?)'
	let params = req.body
	db.query(sql, [params.id, params.title,params.address,params.date], function(err, result) {
		if (err) {
			console.log('添加失败' + err)
		}
		if (result) {
			jsonWrite(res, result)
			console.log(req.body)
		}
	})
})

//显示文章内容接口
app.get('/showDef',(req,res)=>{
	let params = url.parse(req.url,true).query
	let str = JSON.stringify(params);
	str = JSON.parse(str);
	let sql = 'select * from t_def where sign = ?'
	db.query(sql, [str.id],(err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.json(result)
		}
	})
})

//查询文章父评论接口
app.post('/showCom',(req,res)=>{
	let sql = 'select * from t_first where sign = ?'
	let params = req.body
	db.query(sql, [params.id], function(err, result) {
		if (err) {
			console.log('查询失败' + err)
		}
		if (result) {
			res.json(result)
		}
	})
})

//查询文章子评论接口
app.get('/showSec',(req,res)=>{
	let params = url.parse(req.url,true).query
	let str = JSON.stringify(params);
	str = JSON.parse(str);
	let sql = 'select * from t_second where id = ?'
	db.query(sql, [str.id],(err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.json(result)
		}
	})
})

//插入文章子评论接口
app.post('/innerSec',(req,res)=>{
	let sql = 'insert into t_second(id,name,text) values(?,?,?)'
	let params = req.body
	db.query(sql, [params.id,params.name,params.text], function(err, result) {
		if (err) {
			console.log('查询失败' + err)
		}
		if (result) {
			jsonWrite(res, result)
		}
	})
})