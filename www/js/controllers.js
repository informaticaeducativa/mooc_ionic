angular.module('mooc.controllers', ['ngSanitize'])

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
     $scope.titles = [];
     $scope.contents = [];
    CoursesService.listCourseTemariosByInfoCourse($stateParams.courseId)
    .then(function(successResponse) {
      $scope.temarios = successResponse;
      $scope.courseTemarios = [];
      //console.log($scope.temarios[0].titulo);
      //$scope.temarios.length
      for (var i = 0; i < $scope.temarios.length; i++) {
        // $scope.titles[i] = $scope.temarios[i].titulo;
        // $scope.contents[i] = $scope.temarios[i].contenido;
        console.log($scope.temarios[i].titulo);
        console.log($scope.temarios[i].contenido);
        // if ($scope.temarios[i].titulo === 'xxxxxxxxxxx') {
        //   $scope.temarios.length --;
        // }else{
        //
        // }

      $scope.courseTemarios[i] = {
          title: $scope.temarios[i].titulo,
          content: $scope.temarios[i].contenido
        };

      }
      //$scope.titles = [];
      console.log($scope.courseTemarios);

    }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
  }
  refreshTemarios();

  // $scope.titles = [];
  // for (var i=0; i<$scope.titles.length; i++) {
  //   $scope.titles[i] = {
  //     name: i,
  //     temarios: []
  //   };
  //   for (var j=0; j<3; j++) {
  //     $scope.titles[i].temarios.push(i + '-' + j);
  //   }
  // }

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
