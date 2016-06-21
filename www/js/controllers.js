angular.module('mooc.controllers', [])

.controller('AppCtrl', function() {})

// .controller('CoursesCtrl', function($scope, Courses) {

// 	$scope.courses = Courses.all();
// 	// $scope.remove = function(course) {
// 	// 	Courses.remove(course);
// 	// };

//   // $scope.courses = [];
//   //   $http.get('http://informaticaeducativaucc.com/api/cursos')
//   //     .then(function(successResponse){
//   //       $scope.courses = successResponse.data;
//   //       console.log(successResponse.data);
//   //     }, function(errorResponse){
//   //       $scope.error = errorResponse;
//   //   });
// })

// .controller('CourseCtrl', function($scope, $routeParams, Courses) {
//   $scope.course = Courses.get($stateParams.courseId);
// });

.controller('CoursesCtrl', function($scope, $http) {
  $scope.courses = [];
  $http.get('http://informaticaeducativaucc.com/api/cursos').then(function(successResponse) {
    console.log(successResponse.data);
    $scope.courses = successResponse.data;
  }, function(errorResponse){
     $scope.error = errorResponse;
   });
})


.controller('CourseDetailCtrl', function($scope, $stateParams, $http) {

  $scope.courseId = $stateParams.courseId;
  console.log($scope.courseId);
  $scope.course = [];
  $http.get('http://informaticaeducativaucc.com/api/curso/'+$scope.courseId).then(function(successResponse) {
    console.log(successResponse.data);
    $scope.course = successResponse.data;
  }, function(errorResponse){
     $scope.error = errorResponse;
   });
});

//   $scope.courses = [
//     { title: 'Algoritmia I', id: 1 },
//     { title: 'Programación Orientada a Objetos', id: 2 },
//     { title: 'Programación Funcional', id: 3 },
//     { title: 'Desarrollo móvil iOS', id: 4 },
//     { title: 'Desarrollo móvil Android', id: 5 },
//     { title: 'Desarrollo web con AngularJS', id: 6 }
//   ];
// })

// .controller('CourseCtrl', function($scope, $stateParams) {

// 	$scope.courses = [];
// 	    $http.get('http://informaticaeducativaucc.com/api/cursos')
// 	      .then(function(successResponse){
// 	        $scope.courses = successResponse.data;
// 	        console.log(successResponse.data);
// 	    }, function(errorResponse){
// 	        $scope.error = errorResponse;
//     });

// });
