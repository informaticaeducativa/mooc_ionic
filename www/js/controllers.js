angular.module('mooc.controllers', ['ngSanitize'])

.controller('AppCtrl', function() {})

.controller('MenuCtrl', function($scope, auth) {
  $scope.auth = auth;
})

.controller('UserProfileCtrl', function($scope, auth, UsersService) {
  $scope.auth = auth;

  // UsersService.getUserId(auth.profile.identities[0].user_id)
  // .then(function(successResponse) {
  //   $scope.user_id = successResponse.id;
  //   console.log('user_id: ' + $scope.user_id);
  // });

  UsersService.getUser(auth.profile.identities[0].user_id)
  .then(function(successResponse) {
    $scope.user = successResponse;
    console.log('user: ' + $scope.user.id);
  });

})

.controller('OwnCoursesCtrl', function($scope, auth, UserCoursesService, UsersService, CoursesService){
  $scope.auth = auth;

  // function intersection_destructive(a, b) {
  //   var result = [];
  //   while( a.length > 0 && b.length > 0 ) {
  //     if      (a[0] < b[0] ){ a.shift(); }
  //     else if (a[0] > b[0] ){ b.shift(); }
  //     else {
  //       result.push(a.shift());
  //       b.shift();
  //     }
  //   }

  //   return result;
  // }

  function refreshUserCourses() {
    UsersService.getUser(auth.profile.identities[0].user_id)
    .then(function(successResponse) {
      $scope.user = successResponse;
      //console.log('user: ' + $scope.user.id);

      // For spinner's loading control
      $scope.loading = true;
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

          // console.log('Table order: ' + userCoursesTable[0].id_curso);

          for (var i = 0; i < userCoursesTable.length; i++) {
            //console.log('Courses ID: ' + courses[i].id_curso);
            if (courses[i].id_curso === userCourseIds[i]) {
              $scope.userCourses[i] = courses[i];
              $scope.userCourses[i]['tipo_relacion'] = userCoursesTable[i].tipo_relacion;
              // console.log($scope.userCourses[i].tipo_relacion);
              // console.log('userCourses ids: ' + $scope.userCourses[i].id_curso);
              // console.log('userCoursesTable ids: ' + userCoursesTable[i].id_curso);
              console.log('profes asistentes: ' + $scope.userCourses[i].profesores_asistentes[i].nombre);
            }
            
          }
          //console.log($scope.userCourses);
          //console.log($scope.userCourses[0].tipo_relacion);

        })


      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });

    });


  }
  refreshUserCourses();

})

.controller('CoursesCtrl', function($scope, CoursesService, auth, store, $state) {

  $scope.auth = auth;

  function refreshCourses() {
    // For spinner's loading control
    $scope.loading = true;
    CoursesService.list().then(function(successResponse) {
      $scope.courses = successResponse;
      console.log($scope.courses);
      //console.log(auth.isAuthenticated);
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
    // refreshCourses();
  };

})

.controller('CourseDetailCtrl', function($scope, $stateParams, CoursesService) {

  CoursesService.get($stateParams.courseId).then(function(successResponse) {
    $scope.course = successResponse;
    console.log(successResponse.id_curso);
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
