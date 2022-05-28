/**
 * Exam Service. Gets exams, creates new ones, etc.
 */

function _attach_all_tags_marker(exams) {
  for (let e of exams) {
    if (e.tags.length == 0) {
      e.tags.push({
        id: 0,
        display_name: "All Tags"
      });
    }
  }
  return exams;
}

main.factory('ExamsService', function($http) {

  return {
    getExamsFinished: async function() {
      let path = '/exams/all/finished'
        , req = await $http.get(env.apiUrl + path)
        , exams = req.data
      ;

      return _attach_all_tags_marker(exams);
    },
    getExamsInProgress: async function() {
      let path = '/exams/all/in_progress'
        , req = await $http.get(env.apiUrl + path)
        , exams = req.data
      ;

      return _attach_all_tags_marker(exams);
    },
    getExamById: async function(id) {
      let path = '/exams/' + id
        , req = await $http.get(env.apiUrl + path)
        , exam = req.data
      ;

      return exam;
    },
    newExam: async function(tagset, usesAllTags) {
      if (usesAllTags){
        let {data} = await $http.post(`${env.apiUrl}/exams/new_all_tags`);
        return data;
      } else {
        let {data} = await $http.post(`${env.apiUrl}/exams/new`, tagset);
        return data;
      }
    }
  };
});
