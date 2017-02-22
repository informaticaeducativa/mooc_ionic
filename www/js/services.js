const app = angular.module('mooc.services', []);

app.factory('UsersService', function($http) {
  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    getUser: function(socialId) {
      return $http.get(apiUrl + '/usuario/social/' + socialId)
      .then(function(response) {
        return response.data[0];
      });
    },
    getUserId: function(socialId) {
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

    listUserCourses: function(userId) {
      return $http.get(apiUrl + '/curso_usuario/' + userId)
      .then(function(response) {
        return response.data;
      });
    },

    createUserCourse: function(data) {
      return $http.post(apiUrl + '/assign-course/', data)
      .then(function(response) {
        return response.data;
      });
    }

  };
});

app.factory('CoursesService', function($http) {

  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';

  return {
    list: function() {
      return $http.get(apiUrl + '/cursos/').then(function(response) {
        return response.data;
      });
    },
    get: function(courseId) {
      return $http.get(apiUrl + '/curso/' + courseId).then(function(response) {
        return response.data[0];
      });
    },
    listCourseTemarios: function(courseId) {
      return $http.get(apiUrl + '/temarios?id_curso=' + courseId + '&tipo_contenido=info_curso')
      .then(function(response) {
        return response.data;
      });
    },
    getTemario: function(temarioId) {
      return $http.get(apiUrl + '/temario/' + temarioId).then(function(response) {
        return response.data;
      });
    },

  };

});

app.factory('ClassesService', function($http) {
  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    list: function(courseId) {
      return $http.get(apiUrl + '/classes?course_id=' + courseId).then(function(response) {
        return response.data;
      });
    },
    get: function(classId) {
      return $http.get(apiUrl + '/class/' + classId).then(function(response) {
        return response.data[0];
      });
    }
  }
});

app.factory('TestsService', function($http) {
  const apiUrl = 'http://moocucc-roadev.rhcloud.com/api';
  return {
    list: function(courseId) {
      return $http.get(apiUrl + '/tests?course_id=' + courseId).then(function(response) {
        return response.data;
      });
    },
    get: function(testId) {
      return $http.get(apiUrl + '/test/' + testId).then(function(response) {
        return response.data[0];
      });
    },
    listQuestions: function(testId) {
      return $http.get(apiUrl + '/questions?test_id='+ testId).then(function(response) {
        return response.data;
      });
    },
    createAttempt: function(data) {
      return $http.post(apiUrl + '/grade?test_id='+data.test_id+'&user_id='+data.user_id+'&grade='+data.grade+'&attemps='
      +data.attempts+'&course_id='+data.course_id+'&date='+data.date).then(function(response) {
        return response.data;
      });
    },
    updateAttempt: function(data) {
      return $http.put(apiUrl + '/grade?test_id='+data.test_id+'&user_id='+data.user_id+'&grade='+data.grade+'&attemps='
      +data.attempts+'&course_id='+data.course_id+'&date='+data.date).then(function(response) {
        return response.data;
      });
    },
    getAttempts: function(data) {
      return $http.get(apiUrl + '/grade?user_id=' + data.user_id + '&test_id=' + data.test_id)
      .then(function(response) {
        let attempts = 0;
        if (response.data.length > 0) {
          attempts = response.data[0].intentos;
          return attempts;
        } else {
          attempts = 0;
          return attempts;
        }
        console.log('intentos: ', attempts);
      });
    }
  }
})

app.factory('DateService', function() {
  return {
    getDate: function() {
      const dateObject = new Date();
      let dateArray = [
        dateObject.getFullYear().toString(),
        ('0' + (dateObject.getMonth() + 1)).slice(-2),
        dateObject.getDate().toString()
      ];
      dateArray = dateArray.join('-');
      console.log('date: ', dateArray);
      let timeArray = [
        ('0' + (dateObject.getHours())).slice(-2),
        ('0' + (dateObject.getMinutes())).slice(-2),
        ('0' + (dateObject.getSeconds())).slice(-2)
      ];
      timeArray = timeArray.join(':');
      console.log('time: ', timeArray);

      return dateArray + ' ' + timeArray;;
    }

  }

});
