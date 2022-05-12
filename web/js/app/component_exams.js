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
            exams: function(ExamsService){
                return ExamsService.getExams();
            }
        }
    })
});

//==========================================//
// Controller declaration                   //
//==========================================//
function ExamListController ($scope, exams) {
    $scope.exams = exams;
    console.log(exams);
}
