//==========================================//
// Route configuration                      //
//==========================================//
main.config(function($stateProvider){
    $stateProvider.state({
        name: 'exams',
        url: '/exams',
        templateUrl: 'views/exams.html',
        controller: ExamListController,
        resolve: {
            exams_in_progress: function(ExamsService){
                return ExamsService.getExamsInProgress();
            },
            exams_finished: function(ExamsService){
                return ExamsService.getExamsFinished();
            }
        }
    })

    $stateProvider.state({
        name: 'exams_run',
        url: '/exams/run/{examId}',
        templateUrl: 'views/exam_run.html',
        controller: ExamController,
        resolve: {
            exam: function(ExamsService, $transition$){
                return ExamsService.getExamById($transition$.params().examId);
            }
        }
    })

    $stateProvider.state({
        name: 'exams_finish',
        url: '/exams/finish/{examId}',
        templateUrl: 'views/exam_finish.html',
        controller: ExamFinishedController,
        resolve: {
            exam: function(ExamsService, $transition$){
                return ExamsService.getExamById($transition$.params().examId);
            }
        }
    })
});

//==========================================//
// Controller declaration                   //
//==========================================//
function ExamListController ($scope, exams_in_progress, exams_finished) {
    $scope.exams_in_progress = exams_in_progress;
    $scope.exams_finished = exams_finished;
}

function ExamFinishedController($scope, exam){
    $scope.exam = exam;

    for (let q of exam.questions) {
        for (let a of q.question_answers) {
            a.class = "alert-warning"
        }
    }
}

function ExamController ($scope, $http, $state, exam) {
    $scope.exam = exam;
    $scope.number_of_questions = exam.questions.length
    $scope.question_index = 0;
    $scope.current_question = exam.questions[$scope.question_index];
    $scope.correct_answers = 0;
    $scope.next_button_label = "Next"

    if ($scope.number_of_questions == 1) {
        $scope.next_button_label = "Finish Exam"
    }

    $scope.previous_question = () => {
        if ($scope.question_index <= 0){
            return;
        }
        $scope.question_index--;
        $scope.current_question = exam.questions[$scope.question_index];
        $scope.parse_answers();

        if ($scope.number_of_questions > 1) {
            $scope.next_button_label = "Next"
        }
    }

    $scope.next_question = async () => {
        if ($scope.question_index + 1 >= $scope.number_of_questions){
            await $http.post(`${env.apiUrl}/exams/finish`, exam);
            return $state.go('exams_finish', {examId: exam.id});
        }
        $scope.question_index++;
        $scope.current_question = exam.questions[$scope.question_index];
        $scope.parse_answers();

        // If this is now the final question, the
        // next button should instead say "Finish"
        if ($scope.question_index + 1 >= $scope.number_of_questions){
            $scope.next_button_label = "Finish Exam"
        }
    }

    $scope.select_answer = answer => {
        // Clear other selected answers if there is
        // only one correct answer.
        if ($scope.correct_answers == 1){
            $scope.current_question.question_answers.forEach(a => a.is_selected = false);
            $scope.parse_answers();

        // If this is a multi-select question, prevent changes
        // if we've already selected the max number.
        } else {
            let selected_answers = 0;
            $scope.current_question.question_answers.forEach(a => {
                selected_answers += a.is_selected;
            });

            if (answer.is_selected == false && selected_answers == $scope.correct_answers) {
                return;
            }
        }

        answer.is_selected = answer.is_selected ? false : true;
        answer.class = answer.is_selected ? 'alert-info' : 'alert-warning';
        $scope.save_exam();
    }

    $scope.save_exam = function() {
        return $http.post(`${env.apiUrl}/exams/save`, exam);
    };

    // Parse answers for question
    $scope.parse_answers = () => {
        $scope.correct_answers = 0;
        for (let a of $scope.current_question.question_answers) {
            $scope.correct_answers += a.is_correct_answer;
            a.class = a.is_selected ? 'alert-info' : 'alert-warning';
        }
    };
    $scope.parse_answers();

    console.log(exam);
}
