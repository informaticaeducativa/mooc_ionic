'use strict';

var app = angular.module('mooc.services', []);

app.factory('UsersService', function ($http) {
  var apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    getUser: function getUser(socialId) {
      return $http.get(apiUrl + '/usuario/social/' + socialId).then(function (response) {
        return response.data[0];
      });
    },
    getUserId: function getUserId(socialId) {
      return $http.get(apiUrl + '/usuario/social/' + socialId).then(function (response) {
        var userId = response.data[0].id;
        console.log(userId);
        return userId;
      });
    }
  };
});

app.factory('UserCoursesService', function ($http) {
  var apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {

    listUserCourses: function listUserCourses(userId) {
      return $http.get(apiUrl + '/curso_usuario/' + userId).then(function (response) {
        return response.data;
      });
    },

    createUserCourse: function createUserCourse(data) {
      return $http.post(apiUrl + '/assign-course/', data).then(function (response) {
        return response.data;
      });
    }

  };
});

app.factory('CoursesService', function ($http) {

  var apiUrl = 'http://moocucc-roadev.rhcloud.com/api';

  return {
    list: function list() {
      return $http.get(apiUrl + '/cursos/').then(function (response) {
        return response.data;
      });
    },
    get: function get(courseId) {
      return $http.get(apiUrl + '/curso/' + courseId).then(function (response) {
        return response.data[0];
      });
    },
    listCourseTemarios: function listCourseTemarios(courseId) {
      return $http.get(apiUrl + '/temarios?id_curso=' + courseId + '&tipo_contenido=info_curso').then(function (response) {
        return response.data;
      });
    },
    getTemario: function getTemario(temarioId) {
      return $http.get(apiUrl + '/temario/' + temarioId).then(function (response) {
        return response.data;
      });
    }

  };
});

app.factory('ClassesService', function ($http) {
  var apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    list: function list(courseId) {
      return $http.get(apiUrl + '/classes?course_id=' + courseId).then(function (response) {
        return response.data;
      });
    },
    get: function get(classId) {
      return $http.get(apiUrl + '/class/' + classId).then(function (response) {
        return response.data[0];
      });
    }
  };
});

app.factory('TestsService', function ($http) {
  var apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    list: function list(courseId) {
      return $http.get(apiUrl + '/tests?course_id=' + courseId).then(function (response) {
        return response.data;
      });
    },
    get: function get(testId) {
      return $http.get(apiUrl + '/test/' + testId).then(function (response) {
        return response.data[0];
      });
    },
    listQuestions: function listQuestions(testId) {
      return $http.get(apiUrl + '/questions?test_id=' + testId).then(function (response) {
        return response.data;
      });
    },
    createAttempt: function createAttempt(data) {
      return $http.post(apiUrl + '/grade?test_id=' + data.test_id + '&user_id=' + data.user_id + '&grade=' + data.grade + '&attemps=' + data.attempts + '&course_id=' + data.course_id + '&date=' + data.date).then(function (response) {
        return response.data;
      });
    },
    updateAttempt: function updateAttempt(data) {
      return $http.put(apiUrl + '/grade?test_id=' + data.test_id + '&user_id=' + data.user_id + '&grade=' + data.grade + '&attemps=' + data.attempts + '&course_id=' + data.course_id + '&date=' + data.date).then(function (response) {
        return response.data;
      });
    },
    getAttempts: function getAttempts(data) {
      return $http.get(apiUrl + '/grade?user_id=' + data.user_id + '&test_id=' + data.test_id).then(function (response) {
        if (response.data.length > 0) {
          return response.data[0].intentos;
        } else {
          return 0;
        }
        console.log('intentos: ', attempts);
      });
    }
  };
});

app.factory('DateService', function () {
  return {
    getDate: function getDate() {
      var dateObject = new Date();
      var dateArray = [dateObject.getFullYear().toString(), ('0' + (dateObject.getMonth() + 1)).slice(-2), dateObject.getDate().toString()];
      var timeArray = [('0' + dateObject.getHours()).slice(-2), ('0' + dateObject.getMinutes()).slice(-2), ('0' + dateObject.getSeconds()).slice(-2)];

      return _.join(dateArray, '-') + ' ' + _.join(timeArray, ':');
    }

  };
});