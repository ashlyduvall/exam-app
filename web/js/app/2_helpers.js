
//==========================================//
// Filter helpers                           //
//==========================================//
// Handles markdown conversion for exam questions and answers.
main.filter('exam_markdown', ['$sce', function($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
    };
}]);
