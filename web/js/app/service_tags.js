/**
 * Tags service. Functions pertaining to creating, updating and deleting tags and suchlike.
 */

main.factory('TagsService', function() {

    let tags = [];

    for (let i = 1; i <= 10; i++) {
        tags.push({
            id: i,
            body: `Tag ${i}`
        });
    }

    return {
        getTags: async function(limit) {
            limit = limit || 10;
            let ret = tags.slice(0, limit + 1);
            console.log(ret);
            return ret;
        },
        getTag: async function(tagId) {
            let ret = tags.filter(q => q.id == tagId)[0];
            console.log(ret);
            return ret;
        }
    };
});
