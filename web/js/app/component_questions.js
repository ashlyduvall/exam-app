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
        templateUrl: 'views/questions_show.html',
        controller: QuestionController,
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
function QuestionController ($scope, $http, $state, TagsService, question) {
    console.log(question);
    $scope.question = question;
    $scope.save_question = async function(){
        await $http.post(`${env.apiUrl}/questions/save`, question);
        return $state.go('questions_show', {questionId: question.id});
    };
    $scope.add_tag = async function(display_name) {
        // Ensure tag doesn't already exist against this question
        for (let q of question.tags) {
            if (q.display_name == display_name){
                alert(`Tag ${display_name} already assigned`);
                return;
            }
        }

        let t = await TagsService.getTagByDisplayName(display_name);
        question.tags.push(t);
        return $scope.$apply();
    };
}

//==========================================//
// Component declaration                    //
//==========================================//
main.component("questions", {
    bindings: { questions: '<' },
    templateUrl: "views/questions.html",
});
