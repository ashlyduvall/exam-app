//==========================================//
// Route configuration                      //
//==========================================//
main.config(function($stateProvider){
    $stateProvider.state({
        name: 'questions',
        url: '/questions',
        component: 'questions',
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

    $stateProvider.state({
        name: 'questions_edit',
        url: '/questions/edit/{questionId}',
        templateUrl: 'views/questions_edit.html',
        controller: QuestionController,
        resolve: {
            question: function(QuestionsService, $transition$){
                return QuestionsService.getQuestion($transition$.params().questionId);
            }
        }
    })
});

//==========================================//
// Controller declaration                   //
//==========================================//
function QuestionController ($scope, question) {
    console.log(question);
    $scope.question = question;
}

//==========================================//
// Component declaration                    //
//==========================================//
main.component("questions", {
    bindings: { questions: '<' },
    templateUrl: "views/questions.html",
});

main.component("questionsShow", {
    bindings: { question: '<' },
    templateUrl: "views/questions_show.html",
});
