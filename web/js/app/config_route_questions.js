main.config(function($stateProvider){
    $stateProvider.state({
        name: 'questions',
        url: '/questions',
        templateUrl: "views/questions_default.html"
    });

    $stateProvider.state({
        name: 'questions_list',
        url: '/questions/list',
        component: 'questionsList'
    })
});
