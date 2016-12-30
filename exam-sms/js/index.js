/**
 * Created by Administrator on 2016/9/22.
 * 项目的核心js
 */
//收缩全部
//左侧导航动画功能
$(function () {
    //收缩全部
    $(".baseUI>li>ul").slideUp("fast");
    //a绑定ckick事件
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
            $(".baseUI>li>ul").slideUp(300);
            $(this).next().slideDown(300);
    });
    //默认让第一展开
    $(".baseUI>li>a").eq(0).trigger("click");
    //背景改变
    $(".baseUI ul>li").off("click");
    $(".baseUI ul>li").on("click",function () {
        if(!$(this).hasClass("current")){
            $(this).addClass("current").siblings().removeClass("current");
        };
    });
    //默认点击第一个li
    $(".baseUI ul>li").eq(0).find("a").trigger("click");

    $("button").click(function(){
        var opt = $(this).text();
        switch(opt){
            case "删除":
                var delInps = $("td :checkbox:checked");
                var delIds = delInps.map(function(index,item){
                    return $(item).val();
                }).get().join(",");

                delInps.closest("tr").remove();

                break;
            case "添加":

                break;
            case "修改":

                break;
            default:

        }
    });
});

angular.module("app",["ng","ngRoute","app.subjectModule","app.paperModule"])
    .controller("mainController",["$scope",function ($scope) {

    }])
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/SubjectList/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/SubjectManager/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
            templateUrl:"tpl/subject/subjectManager.html",
            controller:"subjectController"
        }).when("/SubjectAdd",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAddSubject",{
            templateUrl:"tpl/paper/paperList.html",
            controller:"subjectController"
        });
    }]);































