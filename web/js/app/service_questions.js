/**
 * Questions service. Functions pertaining to creating, updating and deleting questions and suchlike.
 */

main.factory('QuestionsService', function($http) {

    return {
        getQuestions: async function() {
            let path = '/questions/all'
              , req = await $http.get(env.apiUrl + path)
              , questions = req.data
            ;

            console.log(questions);
            return questions;
        },
        getQuestion: async function(questionId) {
            let path = '/questions/' + questionId
              , req = await $http.get(env.apiUrl + path)
              , questions = req.data
            ;

            console.log(questions);
            return questions;
        }
    };
});
