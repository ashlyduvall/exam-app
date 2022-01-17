questions.config(function($routeProvider){
    $routeProvider
        .when("/main",{
            templateUrl : "views/questions_default.html",
            controller: "DefaultController"
        })
        .otherwise ({
            redirectTo: '/main'
        });
});
