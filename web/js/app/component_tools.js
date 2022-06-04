//==========================================//
// Route configuration                      //
//==========================================//
main.config(function($stateProvider){
    $stateProvider.state({
        name: 'tools',
        url: '/tools',
        templateUrl: 'views/tools.html'
    })

    $stateProvider.state({
        name: 'tools_import_questions',
        url: '/tools/import/questions',
        templateUrl: 'views/tools_import_questions.html',
        controller: ToolsImportQuestionsController
    })
});

//==========================================//
// Controller declaration                   //
//==========================================//
function ToolsImportQuestionsController ($scope, $http, $state, TagsService) {
    $scope.question_text_block = "";
    $scope.error_text = "";
    $scope.error_text_class = "alert-danger";

    $scope.body = "";
    $scope.notes = "";
    $scope.question_answers = [];

    $scope.new_tag_name = "";
    $scope.tags = [];
    $scope.add_tag = async function() {
        let display_name = $scope.new_tag_name;
        $scope.error_text = "";

        // Ensure tag doesn't already exist against this question
        for (let t of $scope.tags) {
            if (t.display_name == display_name){
                $scope.error_text = `Tag ${display_name} already assigned`;
                $scope.error_text_class = "alert-danger";
                return;
            }
        }

        let t = await TagsService.getTagByDisplayName(display_name);
        t.remove = function() {
            $scope.error_text = "";
            $scope.tags = $scope.tags.filter(t => t.display_name != display_name);
        };
        $scope.tags.push(t);
        $scope.new_tag_name = "";
        return $scope.$apply();
    };

    $scope.save_question_enabled = false;
    $scope.start_of_next_question= 0;
    $scope.save_question = async function() {

        let id = 0
          , body = $scope.body
          , notes = $scope.notes
          , question_answers = $scope.question_answers
          , syllabus = {id: 1, display_name: ""}
          , tags = $scope.tags
          , question = {id, body, notes, question_answers, syllabus, tags}
          , {data} = await $http.post(`${env.apiUrl}/questions/save`, question)
        ;

        console.log({question, data});

        // Now remove that question from the block of text so we can fix the next one,
        // unless that was the only question in the block
        if ($scope.start_of_next_question < $scope.question_text_block.length){
            $scope.question_text_block = $scope.question_text_block.substring($scope.start_of_next_question, $scope.question_text_block.length);
        } else {
            $scope.question_text_block = "";
        }

        $scope.parse_question_block();

        $scope.error_text = "Question saved, new ID: " + data.id;
        $scope.error_text_class = "alert-success";
        return $scope.$apply();
    };

    $scope.parse_question_block = function() {
        $scope.save_question_enabled = false;
        $scope.error_text = "";
        $scope.body = "";
        $scope.notes = "";
        $scope.question_answers = [];

        // Rules:
        //   * Find the first triple newline. This will be the end of the
        //     question body.
        let end_of_question_body = $scope.question_text_block.indexOf("\n\n\n")
          , start_of_answer_body = end_of_question_body + 3
        ;

        //     If not found, show an error
        if (end_of_question_body == -1){
            $scope.error_text = "Couldn't work out where the end of the question is.";
            $scope.error_text_class = "alert-danger";
            return;
        }

        //     If we did find it, store it so we can print for debug.
        let question_body = $scope.question_text_block.substring(0, end_of_question_body);
        $scope.body = question_body;
        console.log({question_body});

        //   * Now find the next triple newline, which is the end of the
        //     answer block.
        let end_of_answer_body = $scope.question_text_block.indexOf("\n\n\n", start_of_answer_body);

        //     If not found, assume the answer block is the remaining content
        if (end_of_answer_body == -1){
            end_of_answer_body = $scope.question_text_block.length;
        }

        //     If we did find it, store it to print for debug and parse
        //     the answer block.
        let answer_block_body = $scope.question_text_block.substring(start_of_answer_body, end_of_answer_body);
        console.log({ answer_block_body, start_of_answer_body, end_of_answer_body });

        //  * Now parse the answer block into answers by double newline
        let answer_blocks = answer_block_body.split("\n\n");
        for (let ab of answer_blocks) {
            let answer_class = "alert-danger"
              , is_correct_answer = false
            ;

            // Determine if this is a correct answer
            // this is if the answer is wrapped in
            // parantheses.
            let f_c = ab[0]
              , f_l = ab[ab.length - 1]
            ;
            if (f_c == '(' && f_l == ')'){
                is_correct_answer = true;
                answer_class = "alert-success"
                ab = ab.substring(1, ab.length - 1);
            }

            let answer = {
                body: ab,
                class: answer_class,
                is_correct_answer
            };
            $scope.question_answers.push(answer);
        }

        //  If that was the end of the content, don't bother parsing notes
        if (end_of_answer_body == $scope.question_text_block.length) {
            $scope.start_of_next_question = end_of_answer_body;
            $scope.save_question_enabled = true;
            return;
        }

        //  * Now parse the notes block
        let start_of_notes_block = end_of_answer_body + 3
          , end_of_notes_block = $scope.question_text_block.indexOf("\n\n\n", start_of_notes_block)
        ;

        //     If not found, assume the notes block is the remaining content
        if (end_of_notes_block == -1){
            end_of_notes_block = $scope.question_text_block.length;
        }

        let notes_block = $scope.question_text_block.substring(start_of_notes_block, end_of_notes_block);
        $scope.notes = notes_block;
        console.log({ start_of_notes_block, end_of_notes_block, notes_block });

        // Handle declaring correct answers in the notes block
        if (notes_block.indexOf("Correct Answer:") == 0) {
            let correct_answers_split = notes_block.match(/^Correct Answer: (.*)\n/)
              , answer_index = 'ABCDEFGH'
            ;

            console.log({correct_answers_split});
            let correct_answers = correct_answers_split[1].split("");

            for (let ca of correct_answers) {
                let ai = answer_index.indexOf(ca)
                  , a = $scope.question_answers[ai]
                ;

                a.is_correct_answer = true;
                a.class = "alert-success";
            }

            for (let a of $scope.question_answers) {
                a.body = a.body.replace(/^[A-G]\. /,"");
            }
        }

        $scope.start_of_next_question = end_of_notes_block + 3;
        $scope.save_question_enabled = true;
    };
}
