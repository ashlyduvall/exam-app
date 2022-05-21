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
        name: 'exams_new',
        url: '/exams/new/',
        templateUrl: 'views/exam_new.html',
        controller: ExamNewController,
        resolve: {
            tags: function(TagsService){
                return TagsService.getAllTags();
            }
        }
    });

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

function ExamNewController($scope, $state, $http, ExamsService, tags) {
    $scope.all_tags = tags;
    $scope.filtered_tags = tags;
    $scope.selected_tags = [];
    $scope.filter_string = "";

    for (let t of tags) {
        t.class = "alert-warning"
        t.toggle = function() {
            t.is_selected = t.is_selected ? false : true;

            if (t.is_selected) {
                $scope.selected_tags.push(t);
                t.class = "alert-info";
            } else {
                $scope.selected_tags = $scope.selected_tags.filter(s => s.id != t.id);
                t.class = "alert-warning";
            }
        };
    }

    $scope.filter_tags = function() {
        $scope.filtered_tags = $scope.all_tags.filter(t => t.display_name.indexOf($scope.filter_string) > -1);
    }

    $scope.begin_exam = async function() {
        if ($scope.selected_tags.length == 0) {
            alert('Please select at least one tag');
            return;
        }

        let exam = await ExamsService.newExam($scope.selected_tags);
        return $state.go('exams_run', {examId: exam.id});
    }
}

function ExamFinishedController($scope, exam){
    $scope.total_possible_score = 0;
    $scope.total_score = 0;
    $scope.exam = exam;

    for (let q of exam.questions) {
        for (let a of q.question_answers) {
            if (a.is_correct_answer && a.is_selected){
                $scope.total_possible_score++;
                $scope.total_score++;
                a.class = "alert-success";
            } else if (a.is_correct_answer) {
                $scope.total_possible_score++;
                a.class = "alert-info";
            } else if (a.is_selected) {
                a.class = "alert-danger";
            } else {
                a.class = "alert-warning"
            }
        }
    }

    $scope.score_percent = Math.round(($scope.total_score / $scope.total_possible_score) * 100);
}

function ExamController ($scope, $http, $state, exam) {
    $scope.exam = exam;
    $scope.number_of_questions = exam.questions.length
    $scope.question_index = 0;
    $scope.correct_answers = 0;
    $scope.progress_button_label = ""
    $scope.progress_disabled = true;
    $scope.question_in_answered_state = false;

    // Find the first unanswered question on the exam
    for (let q_index in exam.questions) {
        let answers_selected = 0
          , correct_answers = 0
          , q = exam.questions[q_index]
        ;
        for (let a of q.question_answers) {
            answers_selected += a.is_selected;
            correct_answers += a.is_correct_answer;
        }

        if (answers_selected == correct_answers) {
            continue;
        } else {
            $scope.question_index = parseInt(q_index);
            break;
        }
    }

    $scope.current_question = exam.questions[$scope.question_index];

    if ($scope.number_of_questions == 1) {
        $scope.progress_button_label = "Finish Exam"
    }

    $scope.progress = async () => {
        // If this is the first click, show the correct
        // answers for the question and enable us to move
        // to the next question.
        if (!$scope.question_in_answered_state) {
            $scope.question_in_answered_state = true;
            $scope.parse_answers();
            $scope.progress_button_label = "Next question";

            // If this is the final question, the
            // next button should instead say "Finish"
            if ($scope.question_index + 1 >= $scope.number_of_questions){
                $scope.progress_button_label = "Finish Exam"
            }
            await $scope.save_exam();
            return;
        }

        if ($scope.question_index + 1 >= $scope.number_of_questions){
            await $http.post(`${env.apiUrl}/exams/finish`, exam);
            return $state.go('exams_finish', {examId: exam.id});
        }
        $scope.question_index++;
        $scope.current_question = exam.questions[$scope.question_index];
        $scope.parse_answers();
        $scope.progress_button_label = "Select " + $scope.correct_answers;
        $scope.progress_disabled = true;
        $scope.question_in_answered_state = false;
    }

    $scope.select_answer = answer => {
        // Clear other selected answers if there is
        // only one correct answer.
        if ($scope.correct_answers == 1){
            $scope.current_question.question_answers.forEach(a => a.is_selected = false);
            $scope.parse_answers();
            $scope.progress_button_label = "Submit";
            $scope.progress_disabled = false;

        // If this is a multi-select question, prevent changes
        // if we've already selected the max number.
        } else {
            let selected_answers = 0;
            $scope.current_question.question_answers.forEach(a => {
                selected_answers += a.is_selected;
            });

            if (answer.is_selected == false && selected_answers == $scope.correct_answers) {
                $scope.progress_button_label = "Submit";
                $scope.progress_disabled = false;
                return;
            }
        }

        answer.is_selected = answer.is_selected ? false : true;
        answer.class = answer.is_selected ? 'alert-info' : 'alert-warning';
    }

    $scope.save_exam = function() {
        return $http.post(`${env.apiUrl}/exams/save`, exam);
    };

    // Parse answers for question
    $scope.parse_answers = () => {
        $scope.correct_answers = 0;
        for (let a of $scope.current_question.question_answers) {
            $scope.correct_answers += a.is_correct_answer;
            if (!$scope.question_in_answered_state) {
                a.class = a.is_selected ? 'alert-info' : 'alert-warning';
            } else if (a.is_correct_answer) {
                a.class = a.is_selected ? 'alert-success' : 'alert-info';
            } else {
                a.class = a.is_selected ? 'alert-danger' : 'alert-warning';
            }
        }
    };
    $scope.parse_answers();
    $scope.progress_button_label = "Select " + $scope.correct_answers;

    console.log(exam);
}
