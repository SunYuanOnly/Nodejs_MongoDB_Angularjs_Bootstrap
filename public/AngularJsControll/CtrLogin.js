var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('signupController', function($scope,$uibModal) {
    //打开login页面，弹出$modal

    $uibModal.open({
        templateUrl: 'myModalContent.html',//template模版
        controller: 'ModalInstanceCtrl',//模版控制器
        windowClass:'test'//添加样式
    });
});

//控制$modal登录
app.controller('ModalInstanceCtrl', function($scope,$http,$uibModalInstance) {
    $scope.submitted = false;
    //cancel退出按钮，退出模版
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.signupForm = function() {
        //根据$valid验证信息是否正确，检查登录。
        if ($scope.signup_form.$valid) {
            $http({
                method: 'POST',
                url: '/login',
                data: {
                    name: $scope.name,//帐号名
                    password: $scope.password//密码
                }
            }).success(function(data) {
                console.log(data);
                //data.status=-1,账号密码错误,data.success=true登录成功！
                if(data.status==-1){
                    alert("账号或密码错误");
                }else{
                    $uibModalInstance.dismiss('cancel');
                    location.replace("/index");
                }
            }).error(function() {
                    alert($scope.signup.name);
                    alert($scope.signup.password);
                    alert("登录失败");
            });
        } else {
              $scope.signup_form.submitted = true;
        }
    }
});
