angular.module('mooc.services', [])

.factory('UsersService', function($http) {
  var apiUrl = 'http://informaticaeducativaucc.com/api';
  return {
    getUser: function(social_id) {
      return $http.get(apiUrl + '/usuario/social/' + social_id)
      .then(function(response) {
        return response.data[0];
      });
    }
  };
})

.factory('UserCoursesService', function($http) {
  var apiUrl = 'http://informaticaeducativaucc.com/api';
  return {

    listUserCourses: function(user_id) {
      return $http.get(apiUrl + '/curso_usuario/' + user_id)
      .then(function(response) {
        return response.data;
      });
    },

    createUserCourse: function(data) {
      return $http.post(apiUrl + '/assign-course/', data)
      .then(function(response) {
        return response.data;
        console.log(response);
        console.log(response.data);
        console.log('user_id: ' + user_id);
        console.log('course_id: ' + course_id);
      });
    }

  };
})

.factory('CountriesService', function($http) {
  var apiUrl = 'http://informaticaeducativaucc.com/api';
  return {
    getUser: function(social_id) {
      return $http.get(apiUrl + '/usuario/social/' + social_id)
      .then(function(response) {
        return response.data[0];
      });
    }
  };
})

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
    },

    listCourseTemariosByInfoCourse: function(courseId) {
      return $http.get(apiUrl + '/temarios?id_curso=' + courseId + '&tipo_contenido=info_curso')
      .then(function(response) {
        return response.data;
      });
    },

    getTemario: function(temarioId) {
      return $http.get(apiUrl + '/temario/' + temarioId)
      .then(function(response) {
        return response.data;
      });
    },

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
