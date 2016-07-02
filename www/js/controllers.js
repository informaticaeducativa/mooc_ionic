angular.module('mooc.controllers', ['ngSanitize'])

.controller('AppCtrl', function() {})

.controller('MenuCtrl', function($scope, auth, $rootScope) {
  $scope.auth = auth;
})

.controller('UserProfileCtrl', function($scope, auth, UsersService, $state, store) {
  $scope.auth = auth;

  function refreshUsers() {
    $scope.loading = true;
    UsersService.getUser(auth.profile.identities[0].user_id)
    .then(function(data) {
      $scope.user = data;
      console.log('user: ' + $scope.user.id);
    })
    .finally(function(){
      $scope.loading = false;
    });
  }

  refreshUsers();

  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    //$window.location.reload(true);
    //console.log(auth.isAuthenticated);
    $state.go('app.login');
    // refreshCourses();
  };

})

.controller('OwnCoursesCtrl', function($scope, auth, UserCoursesService, UsersService, CoursesService){
  $scope.auth = auth;

  function refreshUserCourses() {
    // For spinner's loading control
    $scope.loading = true;
    UsersService.getUser(auth.profile.identities[0].user_id)
    .then(function(data) {
      $scope.user = data;
      //console.log('user: ' + $scope.user.id);

      UserCoursesService.listUserCourses($scope.user.id)
      .then(function(data) {
        userCoursesTable = data;
        userCourseIds = [];
        $scope.userCourses = [];
        for (var i = 0; i < userCoursesTable.length; i++) {
          userCourseIds[i] = userCoursesTable[i].id_curso;
        }
        userCourseIds = userCourseIds.sort();
        CoursesService.list().then(function(data) {
          courses = data;
          courses = courses.sort(function (a,b) {
            return a.id_curso - b.id_curso;
          });
          userCoursesTable = userCoursesTable.sort(function (a,b) {
            return a.id_curso - b.id_curso;
          });

          for (var i = 0; i < userCoursesTable.length; i++) {
            //console.log('Courses ID: ' + courses[i].id_curso);
            if (courses[i].id_curso === userCourseIds[i]) {
              $scope.userCourses[i] = courses[i];
              $scope.userCourses[i]['tipo_relacion'] = userCoursesTable[i].tipo_relacion;
              // console.log($scope.userCourses[i].tipo_relacion);
              // console.log('userCourses ids: ' + $scope.userCourses[i].id_curso);
              // console.log('userCoursesTable ids: ' + userCoursesTable[i].id_curso);
              // console.log('profes asistentes: ' + $scope.userCourses[i].profesores_asistentes[i].nombre);
            }
          }
        })
      })

    }).finally(function() {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
  }
  refreshUserCourses();
})

.controller('CoursesCtrl', function($scope, CoursesService, auth, $state, UserCoursesService, $ionicHistory) {

  $scope.auth = auth;

  function refreshCourses() {
    // For spinner's loading control
    $scope.loading = true;
    CoursesService.list().then(function(data) {
      $scope.courses = data;
      console.log($scope.courses);
    }).finally(function() {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
    return $scope.courses;
  }
  refreshCourses();

})

.controller('CourseDetailCtrl', function($scope, $stateParams, $state, auth,
  CoursesService, UsersService, UserCoursesService, $rootScope, $ionicHistory) {

    CoursesService.get($stateParams.courseId).then(function(data) {
      $scope.course = data;
      //console.log(data.id_curso);

      UsersService.getUser(auth.profile.identities[0].user_id)
      .then(function(data) {
        $scope.loading = true;
        $scope.user = data;

        function verifyOwnCourse() {
          UserCoursesService.listUserCourses($scope.user.id)
          .then(function(data) {
            userCoursesTable = data;
            userCourseIds = [];
            $scope.ownCourse = false;
            for (var i = 0; i < userCoursesTable.length; i++) {
              userCourseIds[i] = userCoursesTable[i].id_curso;
              if ($stateParams.courseId == userCourseIds[i]) {
                $scope.ownCourse = true;
              }
            }
          })
        }
        verifyOwnCourse();

        userCourseData = {
          user_id: $scope.user.id,
          course_id: $scope.course.id_curso
        };

        $scope.save = function() {
          UserCoursesService.createUserCourse(userCourseData)
          .then(function() {
            $state.go('app.own-courses');
          });
        };

      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });

    });

    function refreshTemarios() {

      // For spinner's loading control
      $scope.loading = true;
      $scope.titles = [];
      $scope.contents = [];
      CoursesService.listCourseTemariosByInfoCourse($stateParams.courseId)
      .then(function(data) {
        $scope.temarios = data;
        $scope.courseTemarios = [];
        //console.log($scope.temarios[0].titulo);
        for (var i = 0; i < $scope.temarios.length; i++) {
          $scope.courseTemarios[i] = {
            title: $scope.temarios[i].titulo,
            content: $scope.temarios[i].contenido
          };
        }
        //console.log($scope.courseTemarios);

      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
    }
    refreshTemarios();

    /*
    * if given group is the selected group, deselect it
    * else, select the given group
    */
    $scope.toggleGroup = function(title) {
      if ($scope.isGroupShown(title)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = title;
      }
    };
    $scope.isGroupShown = function(title) {
      return $scope.shownGroup === title;
    };

    // $ionicHistory.nextViewOptions({
    //   disableBack: true
    // });

  })

  .controller('ClassesCtrl', function($scope, ClassesService, auth, $stateParams) {

    $scope.auth = auth;

    function refreshClasses() {
      // For spinner's loading control
      $scope.loading = true;
      ClassesService.list($stateParams.courseId).then(function(data) {
        $scope.classes = data;
        $scope.classes = $scope.classes.sort(function (a,b) {
          return a.semana - b.semana;
        });
        //console.log($scope.classes);
        $scope.courseClasses = [];
        classNames = [];
        id = [];
        weekIndex = 1;
        for (var i = 0; i < $scope.classes.length; i++) {
          if ($scope.classes[i].semana == weekIndex) {
            classNames.push($scope.classes[i].nombre);
            id.push($scope.classes[i].id_leccion);
            $scope.courseClasses[i] = {
              id: id,
              week: weekIndex,
              classNames: classNames
            }
          } else if ($scope.classes[i].semana == (weekIndex + 1)) {
            weekIndex ++;
            classNames = new Array();
            id = new Array();
            classNames.push($scope.classes[i].nombre);
            id.push($scope.classes[i].id_leccion);
            $scope.courseClasses[i] = {
              id: id,
              week: weekIndex,
              classNames: classNames
            };
          }
          console.log($scope.courseClasses[i].id);
          //$scope.courseClasses[i].clasNames[i];
        }
        console.log($scope.courseClasses[1].id);
        console.log($scope.courseClasses[2].id);
        //console.log($scope.courseClasses);
      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
      return $scope.courseClasses;
    }
    refreshClasses();

    $scope.toggleGroup = function(week) {
      if ($scope.isGroupShown(week)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = week;
      }
    };
    $scope.isGroupShown = function(week) {
      return $scope.shownGroup === week;
    };
  })

  .controller('ClassDetailCtrl', function($scope, $stateParams, ClassesService, $sce) {

    function refreshClass() {
      $scope.loading = true;
      ClassesService.get($stateParams.classId).then(function(data) {
        $scope.class = data;
        console.log($stateParams.classId);
        //console.log($scope.class.id_leccion);
        //console.log($scope.class.nombre);
        //console.log($scope.class.contenido_grafico);
        //console.log($scope.class.contenido_texto);
        $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("560", "330");
        $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("420", "330");
        $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("315", "280");
        //console.log($scope.class.contenido_grafico);
      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
    }

    $scope.getTrustedHTML = function(str){
      return $sce.trustAsHtml(str);
    }

    refreshClass();
  })

  .controller('LoginCtrl', function($scope, auth, $state, store) {

    function doAuth() {
      auth.signin({
        closable: false,
        // This asks for the refresh token
        // So that the user never has to log in again
        authParams: {
          scope: 'openid offline_access'
        }
      }, function(profile, idToken, accessToken, state, refreshToken) {
        //$scope.isAuthenticated = auth.isAuthenticated;
        store.set('profile', profile);
        store.set('token', idToken);
        store.set('refreshToken', refreshToken);
        $state.go('app.login');
      }, function(error) {
        console.log("There was an error logging in", error);
      });
    }

    $scope.$on('$ionic.reconnectScope', function() {
      doAuth();
    });

    doAuth();

    $scope.auth = auth;

  });
