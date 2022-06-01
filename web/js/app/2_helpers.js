
//==========================================//
// Filter helpers                           //
//==========================================//
// Handles markdown conversion for exam questions and answers.
main.filter('exam_markdown', ['$sce', '$sanitize', function($sce, $sanitize) {
    return function (text) {
        text = text || '';

        // Check for any tables
        text = text.split("\n");

        let in_table = false;
        for (let line_index in text) {
            let this_line = $sanitize(text[line_index]);

            // In table mode
            if (this_line[0] == '|') {
                this_line = '<tr>' + this_line + '</td></tr>';
                this_line = this_line.replace(/\|/g, '</td><td>');
                this_line = this_line.replace('<tr></td>', '<tr>');
                if (!in_table) {
                    in_table = true;
                    this_line = '<table class="table" style="color: lightblue;">' + this_line;
                }
            } else if(in_table) {
                in_table = false;
                this_line = '</table><br />' + this_line;
            } else {
                this_line += '<br />'
            }

            text[line_index] = this_line;
        }
        text = text.join('');

        // text = $sanitize(text);
        return $sce.trustAsHtml(text);
    };
}]);
