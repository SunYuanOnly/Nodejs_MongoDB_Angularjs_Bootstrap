var express = require('express');
var router = express.Router();
var users = require('./../database/mongodb.js');

/* GET index page. */
router.get('/index', function(req, res) {
    //跳转
    res.render('index', { title: '首页' });
});
//注销用户
router.post('/logout',function(req,res){
         req.session.user="";
         res.json({success:true});
});
//查询所有
router.post('/index/list',function(req,res){
    users.find(function(err,result){
        if(err){
            res.send(err);
        }else{
            console.log(result);
            res.json(result);
        }
    });
});
//根据id查询
router.post('/index/findById',function(req,res){
    var id=req.body.id;
    users.find({_id:id},function(err,result){
        if(err){
            res.send(err);
        }else{
            res.json(result);
        }
    });
});
//根据姓名或者地址的关键字查询。（模糊查询）
router.post('/index/findByName',function(req,res){
    var stuname=req.body.stuname;
    users.find({$or:[{stuname:{$regex:stuname}},{adress:{$regex:stuname}}]},function(err,result){
        if(err){
            res.send(err);
        }else{
            res.json(result);
        }
    });
});
//添加用户
router.post('/index/add',function(req,res){
    var stu02=new users();
    stu02.addStu({
        stuname:req.body.stuname,
        age:req.body.age,
        sex:req.body.sex,
        adress:req.body.adress
    },function(){
        res.json({success:true});
    });
});
//删除用户
router.post('/index/delete',function(req,res){
    var id=req.body.id;
    users.remove({_id:id},function(){
        res.json({success:true});
    });
});
//修改用户信息
router.post('/index/edit',function(req,res){
    var id=req.body.id;
    users.update({_id:id},{$set:{stuname:req.body.stuname,age:req.body.age,sex:req.body.sex,adress:req.body.adress}},function(err){
        if(err){
            console.log(err);
        }else{
            res.json({success:true});
        }
    });
});
//分页显示
router.post('/index/pagelist',function(req,res){
       var pageSize=req.body.Page_Size;
       var PageNumber=req.body.Page_Number;
       var query=users.find({});
        query.skip((PageNumber-1)*pageSize);
        query.limit(pageSize);
        //计算分页数据
        query.exec(function(err,rs){
            if(err){
                res.send(err);
            }else{
                //计算数据总数
                users.find(function(err,result){
                    var jsonArray={rows:rs,total:result.length};
                    res.json(jsonArray);
                });
            }
        });
});
module.exports = router;

