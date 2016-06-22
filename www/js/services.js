angular.module('mooc.services', [])
.factory('CoursesService', function($http) {

  var apiUrl = 'http://informaticaeducativaucc.com/api';

  return {

    list: function() {
      return $http.get(apiUrl + '/cursos/').then(function(response) {
        return response.data;
      });
    },

    get: function(courseId) {
      return $http.get(apiUrl + '/curso/' + courseId)
      .then(function(response) {
        return response.data[0];
      });
    }

    // create: function(note) {
    //   return $http.post(apiUrl + '/cursos/', note);
    // },
    //
    // update: function(note) {
    //   return $http.put(apiUrl + '/cursos/' + note.id, note);
    // },
    //
    // remove: function(noteId) {
    //   return $http.delete(apiUrl + '/cursos/' + noteId);
    // }

  };

});
