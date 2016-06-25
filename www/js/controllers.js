angular.module('mooc.controllers', ['ngSanitize'])

.controller('AppCtrl', function() {})

.controller('CoursesCtrl', function($scope, CoursesService, auth, store, $state) {

  //$scope.isAuthenticated = auth.isAuthenticated;


  function refreshCourses() {
    $scope.auth = auth;
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
      $state.go('app.courses');
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
