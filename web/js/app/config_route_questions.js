questions.config(function($routeProvider){
    $routeProvider
        .when("/main",{
            templateUrl : "views/questions_default.html",
            controller: "DefaultController"
        })
        .when("/questions",{
            templateUrl : "views/questions_view.html",
            controller: "QuestionsViewController"
        })
        .when("/tags",{
            templateUrl : "views/questions_default.html",
            controller: "DefaultController"
        })
        .otherwise ({
            redirectTo: '/main'
        });
});
