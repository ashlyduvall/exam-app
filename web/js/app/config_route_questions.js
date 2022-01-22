main.config(function($stateProvider){
    $stateProvider.state({
        name: 'questions',
        url: '/questions',
        templateUrl: "views/questions_default.html"
    });

    $stateProvider.state({
        name: 'questions_list',
        url: '/questions/list',
        component: 'questionsList',
        resolve: {
            questions: function(QuestionsService){
                return QuestionsService.getQuestions();
            }
        }
    })

    $stateProvider.state({
        name: 'questions_show',
        url: '/questions/show/{questionId}',
        component: 'questionsShow',
        resolve: {
            question: function(QuestionsService, $transition$){
                return QuestionsService.getQuestion($transition$.params().questionId);
            }
        }
    })
});
