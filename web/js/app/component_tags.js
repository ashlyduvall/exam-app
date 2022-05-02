//==========================================//
// Route configuration                      //
//==========================================//
main.config(function($stateProvider){
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

//==========================================//
// Component declaration                    //
//==========================================//

main.component("tagsList", {
    bindings: { tags: '<' },
    templateUrl: "views/tags_list.html",
});

main.component("tagsShow", {
    bindings: { tag: '<' },
    templateUrl: "views/tags_show.html",
});
