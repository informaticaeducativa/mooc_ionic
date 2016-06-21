angular.module('mooc.controllers', [])

.controller('AppCtrl', function() {})

.controller('CoursesCtrl', function($scope, Courses) {

	$scope.courses = Courses.all();
	// $scope.remove = function(course) {
	// 	Courses.remove(course);
	// };

  // $scope.courses = [];
  //   $http.get('http://informaticaeducativaucc.com/api/cursos')
  //     .then(function(successResponse){
  //       $scope.courses = successResponse.data;
  //       console.log(successResponse.data);
  //     }, function(errorResponse){
  //       $scope.error = errorResponse;
  //   });
})

.controller('CourseCtrl', function($scope, $stateParams, Courses) {
  $scope.course = Courses.get($stateParams.courseId);
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
