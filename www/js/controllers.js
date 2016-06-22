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

.controller('CoursesCtrl', function($scope, $http) {

  // function refreshCourses() {
  //   CoursesService.list().then(function(successResponse) {
  //     $scope.courses = successResponse;
  //     console.log($scope.courses);
  //   });
  // }
  // refreshCourses();

  $scope.courses = [];
  $http.get('http://informaticaeducativaucc.com/api/cursos').then(function(successResponse) {
    console.log(successResponse.data);
    $scope.courses = successResponse.data;
  }, function(errorResponse){
     $scope.error = errorResponse;
   });
})

// .controller('CourseDetailCtrl', function($scope, $stateParams, CoursesService) {
//   console.log($stateParams.courseId);
//   CoursesService.get($stateParams.courseId).then(function(successResponse) {
//     $scope.course = successResponse;
//     console.log(successResponse);
//   });
//
// });

.controller('CourseDetailCtrl', function($scope, $stateParams, $http) {
  $scope.courseId = $stateParams.courseId;
  console.log($scope.courseId);
  $scope.course = [];
  $http.get('http://informaticaeducativaucc.com/api/curso/'+$scope.courseId)
  .then(function(successResponse) {
    //console.log(successResponse.data);
    $scope.course = successResponse.data[0];
  }, function(errorResponse){
     $scope.error = errorResponse;
   });
});
