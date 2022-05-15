/**
 * Tags service. Functions pertaining to creating, updating and deleting tags and suchlike.
 */

main.factory('TagsService', function($http) {

    return {
        getTagById: async function(tagId) {
            let ret = tags.filter(q => q.id == tagId)[0];
            console.log(ret);
            return ret;
        },
        getAllTags: async function() {
            let {data} = await $http.get(`${env.apiUrl}/tags/all`);
            return data;
        },
        getTagByDisplayName: async function(display_name) {
            let {data} = await $http.post(`${env.apiUrl}/tags/get_or_create`, {display_name});
            return data;
        }
    };
});
