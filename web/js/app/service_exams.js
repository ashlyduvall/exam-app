/**
 * Exam Service. Gets exams, creates new ones, etc.
 */

main.factory('ExamsService', function($http) {

    return {
        getExamsFinished: async function() {
            let path = '/exams/all/finished'
              , req = await $http.get(env.apiUrl + path)
              , exams = req.data
            ;

            return exams;
        },
        getExamsInProgress: async function() {
            let path = '/exams/all/in_progress'
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
