/**
 * Created by Administrator on 2016/9/22.
 * 题库模块
 */

angular.module("app.subjectModule",["ng"])
    .controller("subjectCheckController",["$routeParams","$location","subjectService",function ($routeParams,$location,subjectService) {
        //审核
        subjectService.checkSubject($routeParams.id,$routeParams.state,function (data) {
            alert(data);
        });
        //跳转
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    .controller("subjectDelController",["$routeParams","$location","subjectService",function ($routeParams,$location,subjectService) {
       var flag=confirm("确认删除？");
        if(flag){
            //删除
            subjectService.delSubject($routeParams.id,function (data) {
                alert(data);
            });
        }
        //跳转
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    .controller("subjectController",["$scope","commentService","subjectService","$filter","$routeParams","$location",function ($scope,commentService,subjectService,$filter,$routeParams,$location) {
        //调用服务方法加载题目属性信息，并且进行绑定
        console.log("$routeParams",$routeParams);
        $scope.params=$routeParams;
        $scope.isShow=true;
        //初始化题目信息
        $scope.model = {
            typeId :3,
            levelId:1,
            departmentId:1,
            topicId:1,
            stem:"你做的页面在哪些流览器测试过?这些浏览器的内核分别是什么?",
            answer:"Ie(Trident) 火狐（Gecko） 谷歌（webkit） opera(Presto)",
            analysis:"浏览器最重要或者说核心的部分是'Rendering Engine'，可大概译为'渲染引擎'，不过我们一般习惯将之称为'浏览器内核'。",
            choiceContent:[],
            choiceCorrect:[false,false,false,false]
        };
        $scope.add=function () {
            //保存并继续
            subjectService.saveSubject($scope.model,function (data) {
                alert(data);
            });
            //重置$scope
            var model = {
                typeId :1,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",
                analysis:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            angular.copy(model,$scope.model);
        };
        $scope.addAndClose = function () {
            //保存并关闭，调用service方法完成题目保存
            subjectService.saveSubject($scope.model,function (data) {
                alert(data);
                //跳转到列表页面
                $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
            });
        };
        $scope.resetData=function () {
            //type类型改变是初始化数据
            $scope.model.choiceCorrect=[false,false,false,false];
            $scope.model.choiceContent=[];
            $scope.model.stem="";
            $scope.model.answer="";
            $scope.model.analysis="";
        };
        var subjectModel=(function () {
            var obj={};
            //获取到点击的题型、方向、知识点、难度的id，并将它们放到obj这个对象当中
            if($routeParams.typeId!=0){
                obj['subject.subjectType.id']=$routeParams.typeId;
            }
            if($routeParams.dpId!=0){
                obj['subject.department.id']=$routeParams.dpId;
            }
            if($routeParams.topicId!=0){
                obj['subject.topic.id']=$routeParams.topicId;
            }
            if($routeParams.levelId!=0){
                obj['subject.subjectLevel.id']=$routeParams.levelId;
            }
            console.log("参数对象：",obj);
            return obj;
        })();
        commentService.getAllType(function (data) {
            $scope.types=data;
        });
        commentService.getAllDepartment(function (data) {
            $scope.departments=data;
        });
        commentService.getAllTopics(function (data) {
            $scope.topics=data;
        });
        commentService.getAllLevel(function (data) {
            $scope.levels=data;
        });
        //调用subjectService获取所有题目信息
        subjectService.getAllSubjects(subjectModel,function (data) {
            //遍历所有题目，计算出选题的答案，并将答案赋给subject.answer
            data.forEach(function (subject) {
                //获取正确答案
                if(subject.subjectType && subject.subjectType.id!=3){
                    var answer=[];
                    subject.choices.forEach(function (choice,index) {
                        if(choice.correct){
                            //将索引转换为A/B/C/D
                            answer.push($filter('indexToNo')(index));
                        }
                    });
                    //将计算出来的正确答案赋给subjec.answer,并用toString方法将其以逗号分隔开(没有用toString方法：["C","D"])
                    subject.answer=answer.toString();
                }
            });
            $scope.subjects=data;
            //console.log(data);
        });
        // subjectService.saveSubject();
    }])
    //题目服务，封装操作题目的服务
    .service("subjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        this.checkSubject=function (id,state,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function (data) {
                handler(data);
            });
        }
        this.delSubject=function (id,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function (data) {
                handler(data);
            });
        }
        //service 通过 new 运算符进行实例化， 可以认为是一个类型，
        // 只要把属性和方法添加到 this 对象上即可， 不用显式返回什么对象，
        //controller拿到的就是this指向的那个对象
        this.getAllSubjects=function (params,handler) {
            //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{params:params}).success(function (data) {
            $http.get("data/subjects.json",{params:params}).success(function (data) {
                handler(data);
            });
        };
        //添加题目
        this.saveSubject=function (params,handler) {
            var obj = {};
            for(var key in params){
                var val = params[key];
                console.log("params",params);
                //params就是model对象里面的那一堆属性及对应的属性值
                switch (key){
                    case "typeId":
                        obj['subject.subjectType.id']=val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id']=val;
                        break;
                    case "departmentId":
                        obj['subject.department.id']=val;
                        break;
                    case "topicId":
                        obj['subject.topic.id']=val;
                        break;
                    case "stem":
                        obj['subject.stem']=val;
                        break;
                    case "answer":
                        obj['subject.answer']=val;
                        break;
                    case "analysis":
                        obj['subject.analysis']=val;
                        break;
                    case "choiceContent":
                        obj['choiceContent']=val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect']=val;
                        break;
                }
            }
            console.log(obj);
            //将对象数据转换为表单编码样式的数据
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                handler(data);
            });
        }
    }])
    //用户获取公共服务
    .factory("commentService",["$http",function ($http) {
        //factory 可以认为是设计模式中的工厂方法， 就是你提供一个方法，
        // 该方法返回一个对象的实例， 对于 AngularJS 的 factory 来说，
        // 就是先定义一个对象， 给这个对象添加属性和方法， 然后返回这个对象,
        //controller拿到的就是就是返回的这个大对象
        //与 factory 和 service 稍有不同的是， provider 必须提供一个
        // $get 方法， $get 方法和 factory 要求是一致的，
        // 即： 先定义一个对象， 给这个对象添加属性和方法， 然后返回这个对象
        //最后 controller 拿到的对象就是 provider 的 $get 方法返回的对象
        //factory、 service 与 provider 使用起来是一样的， 都是通过 AngularJS 的依赖注入使用
        return {
            getAllType:function (handler) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                $http.get("data/type.json").success(function (data) {
                    handler(data);
                });
            },
            getAllDepartment:function (handler) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartment/.action").success(function (data) {
                $http.get("data/department.json").success(function (data) {
                    handler(data);
                })
            },
            getAllTopics:function (handler) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                $http.get("data/topics.json").success(function (data) {
                    handler(data);
                })
            },
            getAllLevel:function (handler) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                $http.get("data/level.json").success(function (data) {
                    handler(data);
                })
            }
        };
    }])
    .filter("selectTopics",function () {
        return function (input,departmentId) {
            //input为要过滤的内容(topic数组)，第二个参数是过滤器名后的第一个参数，即方向的id
            if(input){
                var arr=input.filter(function (item) {
                    return item.department.id == departmentId;
                });
                return arr;
            }
        }
    })
    .filter("indexToNo",function () {
        return function (input) {
            var result;
            switch(input){
                case 0:
                    result="A";
                    break;
                case 1:
                    result="B";
                    break;
                case 2:
                    result="C";
                    break;
                default:
                    result="D";
            }
            return result;
        }
    })
    .directive("selectOption",function () {
        return {
            restrict:"A",
            link:function (scope,element) {
                console.log("scope",scope);
                console.log("element",element);
                element.on("change",function () {
                    var type=element.attr("type");
                    var isCheck=element.prop("checked");
                    if(type=="radio"){
                        scope.model.choiceCorrect=[false,false,false,false]
                        var index=angular.element(this).val();
                        //在同导入angular和jQuery的时候angular.element等于jQuery中的$
                        //console.log(scope.model.choiceCorrect);
                        scope.model.choiceCorrect[index]=true;
                        //console.log(scope.model.choiceCorrect);
                    }else if(type=="checkbox" && isCheck){
                        var index=angular.element(this).val();
                        //alert(index+","+isCheck);
                        scope.model.choiceCorrect[index]=true;
                    }
                    //强制将scope更新
                    scope.$digest();
                });
            }
        };
    });
