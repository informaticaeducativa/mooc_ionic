angular.module('mooc.controllers', [])

.controller('AppCtrl', function() {})

// .controller('CoursesCtrl', function($scope, $http) {
//   $scope.courses = [];
//   $http.get('http://informaticaeducativaucc.com/api/cursos').then(function(successResponse) {
//     console.log(successResponse.data);
//     $scope.courses = successResponse.data;
//   }, function(errorResponse){
//      $scope.error = errorResponse;
//    });
// })

.controller('CoursesCtrl', function($scope, CoursesService) {



  function refreshCourses() {
    $scope.loading = true;
    CoursesService.list().then(function(successResponse) {
      $scope.courses = successResponse;
      console.log($scope.courses);
    }).finally(function() {
        // called no matter success or failure
        $scope.loading = false;
      });
  }
  refreshCourses();

  // $scope.courses = [];
  // $http.get('http://informaticaeducativaucc.com/api/cursos').then(function(successResponse) {
  //   console.log(successResponse.data);
  //   $scope.courses = successResponse.data;
  // }, function(errorResponse){
  //    $scope.error = errorResponse;
  //  });
})

.controller('CourseDetailCtrl', function($scope, $stateParams, CoursesService) {
  console.log($stateParams.courseId);
  CoursesService.get($stateParams.courseId).then(function(successResponse) {
    $scope.course = successResponse;
    console.log(successResponse);
  });

})

.controller('LoginCtrl', function($scope, auth, $state, store, $ionicModal) {
   // Form data for the login modal

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  function doAuth() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access'
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
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




  // $scope.authenticate = function(provider) {
  //   $auth.authenticate(provider)
  //     .then(function() {
  //       $ionicPopup.alert({
  //         title: 'Success',
  //         content: 'You have successfully logged in!'
  //       })
  //     })
  //     .catch(function(response) {
  //       $ionicPopup.alert({
  //         title: 'Error',
  //         content: response.data ? response.data || response.data.message : response
  //       })

  //     });
  // };


  // $scope.logout = function() {
  //   $auth.logout();
  // };

  // $scope.isAuthenticated = function() {
  //   return $auth.isAuthenticated();
  // };

});

