angular.module('mooc.services', [])

.factory('CoursesService', function($http) {

  var courses = [];
    $http.get('http://informaticaeducativaucc.com/api/cursos')
      .then(function(successResponse){
        courses = successResponse.data;
        console.log(successResponse.data);
      }, function(errorResponse){
        error = errorResponse;
    });

  return {
    all: function() {
      return courses;
    },
    remove: function(course) {
      courses.splice(courses.indexOf(course), 1);
    },
    get: function(courseId) {
      for (var i = 0; i < courses.length; i++) {
        if (courses[i].id_curso === parseInt(courseId)) {
          return courses[i];
        }
      }
      return null;
    }
  };
});
