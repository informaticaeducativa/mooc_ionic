
angular.module('mooc', ['ionic', 'mooc.controllers', 'mooc.services', 'satellizer'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $authProvider) {

  $authProvider.facebook({
    clientId: '1580733465558680',
    url: 'http://informaticaeducativaucc.com/login-facebook',
    responseType: 'token'
  });

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  // .state('app.search', {
  //   url: '/search',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/search.html'
  //     }
  //   }
  // })

  // .state('app.browse', {
  //     url: '/browse',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/browse.html'
  //       }
  //     }
  //   })
    .state('app.courses', {
      url: '/courses',
      views: {
        'menuContent': {
          templateUrl: 'templates/courses.html',
          controller: 'CoursesCtrl'
        }
      }
    })

  .state('app.course', {
    url: '/courses/:courseId',
    views: {
      'menuContent': {
        templateUrl: 'templates/course.html',
        controller: 'CourseDetailCtrl'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/courses');
});
