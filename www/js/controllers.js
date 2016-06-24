angular.module('mooc.controllers', [])

.controller('AppCtrl', function() {})

.controller('CoursesCtrl', function($scope, CoursesService, auth, store, $state) {


  function refreshCourses() {
    $scope.auth = auth;
    // For spinner's loading control
    $scope.loading = true;
    CoursesService.list().then(function(successResponse) {
      $scope.courses = successResponse;
      console.log($scope.courses);
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
    $state.go('login', {}, {reload: true});
  };

})

.controller('CourseDetailCtrl', function($scope, $stateParams, CoursesService) {

  //console.log($stateParams.courseId);
  CoursesService.get($stateParams.courseId).then(function(successResponse) {
    $scope.course = successResponse;
    //console.log(successResponse);
  });

  function refreshTemarios() {

    // For spinner's loading control
    $scope.loading = true;
    CoursesService.listCourseTemarios($stateParams.courseId)
    .then(function(successResponse) {
      $scope.temarios = successResponse;
      console.log($scope.temarios);
    }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
  }
  refreshTemarios();


})

.controller('LoginCtrl', function($scope, auth, $state, store) {
   // Form data for the login modal

  // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  function doAuth() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access'
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      $scope.isAuthenticated = auth.authenticated;
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('tab.dash');
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

