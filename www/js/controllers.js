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

.controller('LoginCtrl', function($scope, $auth, $ionicModal, $timeout, $ionicPopup) {
   // Form data for the login modal

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });



  // $scope.authenticate = function(provider) {
  //   $auth.authenticate(provider)
  //   .then(function(response) {
  //     console.log('Signed in with facebook');
  //   })
  //   .catch(function(response) {
  //     console.log('Something went wrong.');
  //   });
  //
  //   $scope.isAuthenticated = function() {
  //     return $auth.isAuthenticated();
  //     console.log($auth.isAuthenticated());
  //   };
  //
  //
  // };

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        $ionicPopup.alert({
          title: 'Success',
          content: 'You have successfully logged in!'
        })
      })
      .catch(function(response) {
        $ionicPopup.alert({
          title: 'Error',
          content: response.data ? response.data || response.data.message : response
        })

      });
  };


  $scope.logout = function() {
    $auth.logout();
  };

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

});

// .controller('CourseDetailCtrl', function($scope, $stateParams, $http) {
//   $scope.courseId = $stateParams.courseId;
//   console.log($scope.courseId);
//   $scope.course = [];
//   $http.get('http://informaticaeducativaucc.com/api/curso/'+$scope.courseId)
//   .then(function(successResponse) {
//     //console.log(successResponse.data);
//     $scope.course = successResponse.data[0];
//   }, function(errorResponse){
//      $scope.error = errorResponse;
//    });
// });
