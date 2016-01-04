var mongoose = require('mongoose');
var db=mongoose.connect('mongodb://localhost:27017/test'); //连接test数据库
var Schema=mongoose.Schema; //创建模型
var users=new Schema({
	name:String,
	password:String,
    stuname:String,
    age:Number,
    sex:String,
    adress:String
});

users.methods.addStu=function(users,callback){
    this.stuname=users.stuname;
    this.age=users.age;
    this.sex=users.sex;
    this.adress=users.adress;
	this.save(callback);
}
var users=db.model('users',users);
//exports.users=users;
module.exports=users;
