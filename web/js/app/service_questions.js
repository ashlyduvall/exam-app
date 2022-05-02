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

            question.save = function(){
                return $http.post(`${env.apiUrl}/questions/save`, question);
            };

            question.add_tag = async function(display_name){
                // Ensure tag doesn't already exist against this question
                for (let q of question.tags) {
                    if (q.display_name == display_name){
                        alert(`Tag ${display_name} already assigned`);
                        return;
                    }
                }

                let t = await TagsService.getTagByDisplayName(display_name);
                question.tags.push(t);
            };

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
