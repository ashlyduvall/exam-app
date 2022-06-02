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
        getQuestionsWithFilter: async function(filter) {
            let path = '/questions/all/' + filter
              , req = await $http.get(env.apiUrl + path)
              , questions = req.data
            ;

            return questions;
        },
        getQuestion: async function(questionId) {

            if (questionId == 0) {
                return {
                    id: 0,
                    body: "",
                    syllabus: {id: 1, display_name: ""},
                    question_answers: [],
                    tags: []
                };
            }

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
