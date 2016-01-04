/**
 * Created by sunyuan on 2015/12/14.
 */
var express = require('express');
var router = express.Router();
var users = require('./../database/mongodb.js');
/* GET login page. */
router.get('/', function(req, res) {
    res.render('login', { title: '登录' });
});
//登录接口
router.post('/login', function(req, res) {
    var name = req.body.name;  //data传过来的name
    var password = req.body.password; //data传过来的password
    //新建user.json用来后面的session存储
    var user = {
        username: name,
        password: password
    };
    users.find({name:name,password:password},function(err,rs){
        if(err){
         }else{
            if(rs.length){
                //登录成功保存用户信息，返回json
                req.session.user=user;
                res.json({success:true});
               // console.log(req.session.user);
            }else{
                //登录失败
                res.json({status:-1});
            }
        }

    });
});
module.exports = router;
