app.config(function($routeProvider){
    $routeProvider
        .when("/",{
            templateUrl : "views/default.html",
            controller: "DefaultController"
        })
        .otherwise ({
            redirectTo: '/'
        });
});
