/**
 * Exam Service. Gets exams, creates new ones, etc.
 */

main.factory('ExamsService', function($http) {

    return {
        getExams: async function() {
            let path = '/exams/all'
              , req = await $http.get(env.apiUrl + path)
              , exams = req.data
            ;

            return exams;
        },
        getExamById: async function(id) {
            let path = '/exams/' + id
              , req = await $http.get(env.apiUrl + path)
              , exam = req.data
            ;

            return exam;
        }
  };
});
