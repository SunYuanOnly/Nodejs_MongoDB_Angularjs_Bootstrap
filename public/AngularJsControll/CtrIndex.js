/**
 * Created by sunyuan on 2015/12/18.
 */
var apps = angular.module('myIndex', ['ui.bootstrap']);
var selectionId="";//radio被选中时当前id;
var url="";//接口路径
var data="";//请求接口，所需的参数
apps.controller('Index_list', function($rootScope,$scope,$http,$uibModal) {
        var current_index=1;//current_index当前页数，1为首页。依次类推。
        var PageSize=4;//每一页显示多少条
        var total=0;//总数
        /*
         *网页加载分页显示所有用户信息
         * */
        Paging(current_index,PageSize);
        $scope.test=function(){
            location.href = '/users';
        };
         //根据页面传的数字，显示当前为第几页
         $scope.Page=function(index){
            current_index=index;
            Paging(current_index,PageSize);
       };
        //上一页prePage
        $scope.prePage=function(){
            if(current_index == 1){
                alert('当前为首页！');
                return false;
            }else{
                current_index=current_index-1;
                Paging(current_index,PageSize);
            }
        };
        //下一页nextPage
        $scope.nextPage=function(){
            if(current_index==parseInt((total / PageSize), 10)+1){
                alert('当前是最后一页！');
                return false;
            }else{
                current_index=current_index+1;
                Paging(current_index,PageSize);
            }
        };
        //最后一页LastPage
        $scope.LastPage=function(){
            current_index=parseInt((total / PageSize), 10)+1;
            Paging(current_index,PageSize);
        };
      /*
       *分页方法
       * current_index为当前页，PageSize每页显示的条数
       */
      function  Paging(current_index,PageSize) {
          $http({
              method: 'POST',
              url: '/index/pagelist',
              data: {
                  Page_Size: PageSize,
                  Page_Number: current_index
              }
          }).success(function (data) {
              //赋值给$model里的data。然后view里面用ng-repeat遍历、
              $scope.data = data.rows;
              total=data.total;//获得总数
          }).error(function (data) {
              console.log(data);
          });
      }
     /*
       *根据用户stuname筛选用户信息
        **/
    $scope.Search=function(){
        if($scope.searchName){//如果searchName值不为空
            $http({
                method: 'POST',
                url: '/index/findByName',
                data:{
                    stuname:$scope.searchName
                }
            }).success(function(data) {
                    $scope.data=data;//根据searchName查询到的数据，然后ng-repeat遍历
            }).error(function(data) {
                    console.log(data);
            });
        }else{
            //如果searchName为空,分页显示第1页的数据
            Paging(1,PageSize);
        }
    }
    //注销用户
    $scope.logout=function(){
        $http({
            method: 'POST',
            url: '/logout'
        }).success(function(data) {
            if(data.success==true){
                if(data.success=true){
                    alert("注销成功！");
                    location.href = '/';
                };
            }
        }).error(function(data) {
            console.log(data);
        });
    }
    //添加用户信息
    $scope.openUserAddDialog=function(){
        var scope = $rootScope.$new();
        scope.titles="添加用户";
        scope.url='/index/add';
        $uibModal.open({
            templateUrl: 'MyIndexMessage.html',
            controller:'MessageController',
            windowClass:'test',
            scope:scope
        });
    };
    //判断单选radio是否被选中
    $scope.Selection = function($event){
        console.log($event);
        //获取被选中id
        selectionId=$event.target.id;
     }
    /*
    * 根据id修改用户信息
    * */
    $scope.openUserModifyDialog=function(){
        //console.log(selectionId);
        if(selectionId){
            //根据id查询信息
            $http({
                method: 'POST',
                url: '/index/findById',
                data:{
                    id:selectionId
                }
            }).success(function(data) {
                //console.log(data);
                var scope = $rootScope.$new();
                //scope.datas="修改信息"
                scope.titles='修改信息',
                scope.url='/index/edit',
                scope.data={
                    id:data[0].id,
                    stuname:data[0].stuname,
                    sex:data[0].sex,
                    age:data[0].age,
                    adress:data[0].adress
                },
                //根据selectionId查询成功，将返回的信息显示在$modal里面
                scope.id=data[0].id,
                scope.stuname=data[0].stuname,
                scope.sex=data[0].sex,
                scope.age=data[0].age,
                scope.adress=data[0].adress;
                $uibModal.open({
                    templateUrl: 'MyIndexMessage.html',
                    controller:'MessageController',
                    windowClass:'test',
                    scope:scope
                });
            }).error(function(data) {
                console.log(data);
            });
        }else{
            alert('请选择要修改的用户！')
        }
    };
    /*
    * 删除用户
    * */
    $scope.deleteUser=function(){
        //根据是selectionId是否存在
        if(selectionId){
            $http({
                method: 'POST',
                url: '/index/delete',
                data:{
                    id:selectionId
                }
            }).success(function(data) {
                if(data.success=true){
                    alert("删除成功！");
                    location.replace("/index")
                };
            }).error(function(data) {
                alert("删除失败！");
            });
        }else{
               alert('请选择要删除的用户！')
        }
    };
});
//添加、修改信息控制器。根据传过来的scope不同。判断需要的是修改，还是添加。
apps.controller('MessageController', function($scope,$http,$uibModalInstance) {
        $scope.title=$scope.titles;
       // console.log($uibModalInstance);
        var params="";;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
       $scope.saveUser=function(){
         if($scope.title=="添加用户"){
              params={
                 stuname:$scope.stuname,
                 sex:$scope.sex,
                 age:$scope.age,
                 adress:$scope.adress
             }
         }else{
             params={
                 id:selectionId,
                 stuname:$scope.stuname,
                 sex:$scope.sex,
                 age:$scope.age,
                 adress:$scope.adress
             }
         }
        $http({
            method: 'POST',
            url:  $scope.url,
            data:params
        }).success(function(data) {
            if(data.success){
                 alert("保存成功");
                 location.replace("/index");
           }else{
                alert("保存失败");
                location.replace("/index");
              return;
            }
        }).error(function(data) {
            console.log($scope.stuname);
            console.log(data);
        });
    }
});