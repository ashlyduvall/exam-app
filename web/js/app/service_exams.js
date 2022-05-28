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

function _calculate_exam_score(exams) {
  for (let e of exams) {
    let total_score = 0
      , total_possible_score = 0
    ;

    for (let q of e.questions) {
      for (let a of q.question_answers) {
        if (a.is_correct_answer) {
          total_possible_score++;
          if (a.is_selected) {
            total_score++;
          }
        }
      }
    }

    e.total_score = total_score;
    e.total_possible_score = total_possible_score;
    e.percentage_achieved = Math.round((total_score / total_possible_score) * 100);
  }
}

main.factory('ExamsService', function($http) {

  return {
    getExamsFinished: async function() {
      let path = '/exams/all/finished'
        , req = await $http.get(env.apiUrl + path)
        , exams = req.data
      ;

      _calculate_exam_score(exams);
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
