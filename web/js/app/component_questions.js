//==========================================//
// Route configuration                      //
//==========================================//
main.config(function($stateProvider){
    $stateProvider.state({
        name: 'questions',
        url: '/questions',
        templateUrl: 'views/questions.html',
        controller: QuestionListController,
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
    $scope.question = question;
    $scope.save_question = async function(){
        let req = await $http.post(`${env.apiUrl}/questions/save`, question);
        question = req.data;
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
    $scope.delete_answer = function(answer) {
        question.question_answers = question.question_answers.filter(a => a.id != answer.id);
    };
}

function QuestionListController ($scope, questions) {
    const QUESTION_DISPLAY_LENGTH = 100;
    for (let q of questions) {
        if (q.body.length > QUESTION_DISPLAY_LENGTH) {
            q.body = q.body.substring(0, QUESTION_DISPLAY_LENGTH) + '...';
        }
    }

    $scope.all_questions = questions;
    $scope.questions = questions;
    $scope.filter_string = "";

    $scope.filter_questions = function() {
        $scope.questions = $scope.all_questions.filter(q => {
            if (q.body.indexOf($scope.filter_string) > -1){
                return true;
            }

            for (let t of q.tags) {
                if (t.display_name.indexOf($scope.filter_string) > -1){
                    return true;
                }
            }
            return false;
        });
    };
}
