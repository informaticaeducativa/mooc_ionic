
angular.module('mooc', ['ionic', 'mooc.controllers', 'mooc.services',
'auth0', 'angular-storage', 'angular-jwt'])

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

.config(function($stateProvider, $urlRouterProvider,
  authProvider, jwtInterceptorProvider, $httpProvider) {


    $stateProvider

    .state('app', {
      url: '/app',
      //abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'MenuCtrl'
      // data: {
      //   requiresLogin: true
      // }
    })

    .state('app.login', {
      url: '/login',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.own-courses', {
      url: '/own-courses',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/own-courses.html',
          controller: 'OwnCoursesCtrl'
        }
      }
    })

    .state('app.profile', {
      url: '/profile',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'UserProfileCtrl'
        }
      }
    })

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
    })

    .state('app.classes', {
      url: '/classes/:courseId',
      views: {
        'menuContent': {
          templateUrl: 'templates/classes.html',
          controller: 'ClassesCtrl'
        }
      }
    });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/courses');

    // Configure Auth0
    authProvider.init({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      loginState: 'app.login'
    });

    jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
      var idToken = store.get('token');
      var refreshToken = store.get('refreshToken');
      if (!idToken || !refreshToken) {
        return null;
      }
      if (jwtHelper.isTokenExpired(idToken)) {
        return auth.refreshIdToken(refreshToken).then(function(idToken) {
          store.set('token', idToken);
          return idToken;
        });
      } else {
        return idToken;
      }
    }

    $httpProvider.interceptors.push('jwtInterceptor');

  }).run(function($rootScope, auth, store) {
    $rootScope.$on('$locationChangeStart', function() {
      if (!auth.isAuthenticated) {
        var token = store.get('token');
        if (token) {
          auth.authenticate(store.get('profile'), token);
        }
      }

    });


  });
