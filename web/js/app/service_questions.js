/**
 * Questions service. Functions pertaining to creating, updating and deleting questions and suchlike.
 */

main.factory('QuestionsService', function() {

    let questions = [];

    for (let i = 1; i <= 10; i++) {
        questions.push({
            id: i,
            body: `This is question ${i}.`,
            answers: [
                {
                    id: 10 + i,
                    body: "foo"
                },{
                    id: 30 + i,
                    body: "bah"
                }
            ]
        });
    }

    return {
        getQuestions: async function(limit) {
            limit = limit || 10;
            let ret = questions.slice(0, limit + 1);
            console.log(ret);
            return ret;
        }
    };
});
