const app = angular.module('mooc.services', []);

app.factory('UsersService', function($http) {
  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    getUser: (socialId) => {
      return $http.get(apiUrl + '/usuario/social/' + socialId)
      .then(function(response) {
        return response.data[0];
      });
    },
    getUserId: (socialId) => {
      return $http.get(apiUrl + '/usuario/social/' + socialId)
      .then(function(response) {
        const userId = response.data[0].id;
        console.log(userId);
        return userId;
      });
    }
  };
});

app.factory('UserCoursesService', function($http) {
  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {

    listUserCourses: (userId) => {
      return $http.get(apiUrl + '/curso_usuario/' + userId)
      .then(function(response) {
        return response.data;
      });
    },

    createUserCourse: (data) => {
      return $http.post(apiUrl + '/assign-course/', data)
      .then((response) => {
        return response.data;
      });
    }

  };
});

app.factory('CoursesService', ($http) => {

  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';

  return {
    list: () => {
      return $http.get(apiUrl + '/cursos/').then((response) => {
        return response.data;
      });
    },
    get: (courseId) => {
      return $http.get(apiUrl + '/curso/' + courseId).then((response) => {
        return response.data[0];
      });
    },
    listCourseTemarios: (courseId) => {
      return $http.get(apiUrl + '/temarios?id_curso=' + courseId + '&tipo_contenido=info_curso')
      .then(function(response) {
        return response.data;
      });
    },
    getTemario: (temarioId) => {
      return $http.get(apiUrl + '/temario/' + temarioId).then((response) => {
        return response.data;
      });
    },

  };

});

app.factory('ClassesService', function($http) {
  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    list: (courseId) => {
      return $http.get(apiUrl + '/classes?course_id=' + courseId).then(function(response) {
        return response.data;
      });
    },
    get: (classId) => {
      return $http.get(apiUrl + '/class/' + classId).then((response) => {
        return response.data[0];
      });
    }
  }
});

app.factory('TestsService', function($http) {
  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    list: (courseId) => {
      return $http.get(apiUrl + '/tests?course_id=' + courseId).then((response) => {
        return response.data;
      });
    },
    get: (testId) => {
      return $http.get(apiUrl + '/test/' + testId).then((response) => {
        return response.data[0];
      });
    },
    listQuestions: (testId) => {
      return $http.get(apiUrl + '/questions?test_id='+ testId).then((response) => {
        return response.data;
      });
    },
    createAttempt: (data) => {
      return $http.post(apiUrl + '/grade?test_id=' + data.test_id + '&user_id=' + data.user_id + '&grade='+ data.grade + '&attemps='
      + data.attempts+'&course_id='+data.course_id+'&date='+data.date).then((response) => {
        return response.data;
      });
    },
    updateAttempt: (data) => {
      return $http.put(apiUrl + '/grade?test_id='+data.test_id+'&user_id='+data.user_id+'&grade='+data.grade+'&attemps='
      +data.attempts+'&course_id='+data.course_id+'&date='+data.date).then((response) => {
        return response.data;
      });
    },
    getAttempts: (data) => {
      return $http.get(apiUrl + '/grade?user_id=' + data.user_id + '&test_id=' + data.test_id)
      .then((response) => {
        if (response.data.length > 0) {
          return response.data[0].intentos;
        } else {
          return 0;
        }
        console.log('intentos: ', attempts);
      });
    }
  }
})

app.factory('DateService', function() {
  return {
    getDate: () => {
      const dateObject = new Date();
      const dateArray = [
        dateObject.getFullYear().toString(),
        ('0' + (dateObject.getMonth() + 1)).slice(-2),
        dateObject.getDate().toString()
      ];
      const timeArray = [
        ('0' + (dateObject.getHours())).slice(-2),
        ('0' + (dateObject.getMinutes())).slice(-2),
        ('0' + (dateObject.getSeconds())).slice(-2)
      ];

      return _.join(dateArray, '-') + ' ' + _.join(timeArray, ':');
    }

  }

});
