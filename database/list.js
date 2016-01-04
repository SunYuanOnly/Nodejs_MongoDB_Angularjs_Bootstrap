/**
 * Created by chao on 2015/12/16.
 */
var mongoose = require('mongoose');
var db=mongoose.connect('mongodb://localhost:27017/test'); //连接test数据库

var Schema=mongoose.Schema; //创建模型
var studentSchema=new Schema({
    stuname:String,
    age:Number,
    sex:String,
    adress:String
});

studentSchema.methods.addStu=function(student,callback){
    this.stuname=student.stuname;
    this.age=student.age;
    this.sex=student.sex;
    this.adress=student.adress;
    this.save(callback);
}
var student=db.model('students',studentSchema);
module.exports=student;
