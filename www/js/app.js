
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

.config(function($authProvider) {
  var commonConfig = {
    popupOptions: {
      location: 'no',
      toolbar: 'yes',
      width: window.screen.width,
      height: window.screen.height
    }
  };

  if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
    commonConfig.redirectUri = 'http://localhost';
  }

  $authProvider.storageType = 'localStorage';

  $authProvider.facebook(angular.extend({}, commonConfig, {
    clientId: '1580733465558680',
    url: 'http://informaticaeducativaucc.com/login-facebook'
  }));

  $authProvider.twitter(angular.extend({}, commonConfig, {
    url: 'http://localhost:3000/auth/twitter'
  }));

  $authProvider.google(angular.extend({}, commonConfig, {
    clientId: '1008466316631-0t9ugiltj87a3jl7tsksggi2ipp9b1nt.apps.googleusercontent.com',
    url: 'http://informaticaeducativaucc.com/login-google'
  }));
})

.config(function($stateProvider, $urlRouterProvider) {

  // $authProvider.facebook({
  //   clientId: '1580733465558680',
  //   url: 'http://informaticaeducativaucc.com/login-facebook',
  //   responseType: 'token'
  // });
  //
  // $authProvider.google({
  //   clientId: '1008466316631-0t9ugiltj87a3jl7tsksggi2ipp9b1nt.apps.googleusercontent.com',
  //   url: 'http://informaticaeducativaucc.com/login-google'
  // });

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
