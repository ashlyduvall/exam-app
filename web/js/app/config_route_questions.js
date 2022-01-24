main.config(function($stateProvider){
    $stateProvider.state({
        name: 'questions',
        url: '/questions',
        templateUrl: "views/questions_default.html"
    });

    $stateProvider.state({
        name: 'questions_list',
        url: '/questions/list',
        component: 'questionsList',
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
        name: 'tags_list',
        url: '/tags/list',
        component: 'tagsList',
        resolve: {
            tags: function(TagsService){
                return TagsService.getTags();
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
