/**
 * Created by Administrator on 2016/9/22.
 * 试卷模块
 */
angular.module("app.paperModule",["ng","app.subjectModule"])
    .controller("paperAddController",["$scope","commentService","paperModel","$routeParams",function ($scope,commentService,paperModel,$routeParams) {
        //将查询到的所有方向数据绑定到作用域中
        commentService.getAllDepartment(function (data) {
            $scope.departments=data;
        });
        $scope.model=paperModel.model;
        var id=$routeParams.id;
        if(id!=0){
            paperModel.addSubjectId(id);
            paperModel.addSubject(angular.copy($routeParams));
        }

    }])
    .controller("paperListController",["$scope",function ($scope) {

    }])
    .factory("paperService",["$http","$httpParamSerializer"],function ($http,$httpParamSerializer) {
        return{
            savePaper:function (model,handler) {
                var obj={};
                for(var key in model){
                    var val=model[key];
                    switch (key){
                        case "dId":
                            obj['paper.department.id']=val;
                            break;
                        case "title":
                            obj['paper.title']=val;
                            break;
                        case "desc":
                            obj['paper.description']=val;
                            break;
                        case "tt":
                            obj['paper.totalPoints']=val;
                            break;
                        case "at":
                            obj['paper.answerQuestionTime']=val;
                            break;
                        case "scores":
                            obj['scores']=val;
                            break;
                        case "subjectIds":
                            obj['subjectIds']=val;
                            break;
                    }
                }
                obj = $httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                });
            }
        };
    })
    .factory("paperModel",function () {
        return {
            model:{
                dId:1,
                title:"",
                desc:"",
                tt:"",
                at:"",
                scores:[],
                subjectIds:[],
                subjects:[]
            },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject:function (subject) {
                this.model.subjects.push(subject);
            },
            addScore:function (score) {
                this.model.scores [index]=score;
            }
        };
    })





















