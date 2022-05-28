
//==========================================//
// Filter helpers                           //
//==========================================//
// Handles markdown conversion for exam questions and answers.
main.filter('exam_markdown', ['$sce', '$sanitize', function($sce, $sanitize) {
    return function (text) {
        text = text || '';
        text = text.replace(/\n/g, '<br/>');
        text = $sanitize(text);
        return $sce.trustAsHtml(text);
    };
}]);
