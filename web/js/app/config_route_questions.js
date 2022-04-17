main.config(function($stateProvider){
    $stateProvider.state({
        name: 'questions',
        url: '/questions',
        component: 'questions',
        resolve: {
            questions: function(QuestionsService){
                return QuestionsService.getQuestions();
            }
        }
    })

    $stateProvider.state({
        name: 'questions_show',
        url: '/questions/show/{questionId}',
        component: 'questionsShow',
        resolve: {
            question: function(QuestionsService, $transition$){
                return QuestionsService.getQuestion($transition$.params().questionId);
            }
        }
    })

    $stateProvider.state({
        name: 'tags_show',
        url: '/tags/show/{tagId}',
        component: 'tagsShow',
        resolve: {
            tag: function(TagsService, $transition$){
                return TagsService.getTag($transition$.params().tagId);
            }
        }
    })
});
