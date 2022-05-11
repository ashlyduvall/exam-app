/**
 * Questions service. Functions pertaining to creating, updating and deleting questions and suchlike.
 */

main.factory('QuestionsService', function($http, TagsService) {

    return {
        getQuestions: async function() {
            let path = '/questions/all'
              , req = await $http.get(env.apiUrl + path)
              , questions = req.data
            ;

            return questions;
        },
        getQuestion: async function(questionId) {
            let path = '/questions/' + questionId
              , req = await $http.get(env.apiUrl + path)
              , question = req.data
            ;

            question.question_answers.forEach(a => {
                a.class = a.is_correct_answer ? 'alert-success' : 'alert-danger';
            });

            question.tags.forEach(t => {
                let id = t.id;
                t.remove = () => {
                    question.tags = question.tags.filter(t => t.id != id);
                };
            });
            return question;
        }
    };
});
