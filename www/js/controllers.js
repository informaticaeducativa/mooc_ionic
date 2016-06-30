angular.module('mooc.controllers', ['ngSanitize'])

.controller('AppCtrl', function() {})

.controller('MenuCtrl', function($scope, auth, $rootScope) {
  $scope.auth = auth;
})

.controller('UserProfileCtrl', function($scope, auth, UsersService, $state, store) {
  $scope.auth = auth;

  function refreshUsers() {
    UsersService.getUser(auth.profile.identities[0].user_id)
    .then(function(successResponse) {
      $scope.loading = true;
      $scope.user = successResponse;
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
    UsersService.getUser(auth.profile.identities[0].user_id)
    .then(function(successResponse) {
      // For spinner's loading control
      $scope.loading = true;
      $scope.user = successResponse;
      //console.log('user: ' + $scope.user.id);

      UserCoursesService.listUserCourses($scope.user.id)
      .then(function(successResponse) {
        userCoursesTable = successResponse;
        userCourseIds = [];
        $scope.userCourses = [];
        for (var i = 0; i < userCoursesTable.length; i++) {
          userCourseIds[i] = userCoursesTable[i].id_curso;
        }
        userCourseIds = userCourseIds.sort();
        CoursesService.list().then(function(successResponse) {
          courses = successResponse;
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
    CoursesService.list().then(function(successResponse) {
      $scope.courses = successResponse;
      console.log($scope.courses);
    }).finally(function() {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
    return $scope.courses;
  }
  refreshCourses();

  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    //$window.location.reload(true);
    //console.log(auth.isAuthenticated);
    $state.go($state.current, {}, {reload: true});
  };

  $ionicHistory.nextViewOptions({
    disableBack: true
  });

})

.controller('CourseDetailCtrl', function($scope, $stateParams, $state, auth,
  CoursesService, UsersService, UserCoursesService, $rootScope) {

    CoursesService.get($stateParams.courseId).then(function(successResponse) {
      $scope.course = successResponse;
      console.log(successResponse.id_curso);
      
      UsersService.getUser(auth.profile.identities[0].user_id)
      .then(function(successResponse) {
        $scope.loading = true;
        $scope.user = successResponse;
        console.log('user: ' + $scope.user.id);

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
      .then(function(successResponse) {
        $scope.temarios = successResponse;
        $scope.courseTemarios = [];
        //console.log($scope.temarios[0].titulo);
        for (var i = 0; i < $scope.temarios.length; i++) {

          $scope.courseTemarios[i] = {
            title: $scope.temarios[i].titulo,
            content: $scope.temarios[i].contenido
          };
        }
        console.log($scope.courseTemarios);

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
