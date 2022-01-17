main.config(function($routeProvider){
    $routeProvider
        .when("/main",{
            templateUrl : "views/default.html",
            controller: "DefaultController"
        })
        .otherwise ({
            redirectTo: '/main'
        });
});
