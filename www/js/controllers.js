angular.module('mooc.controllers', ['ngSanitize'])

.controller('AppCtrl', function() {})

.controller('MenuCtrl', function($scope, auth, $rootScope) {
  // This scope is used for conditional menu items (relationed with authentication)
  $scope.auth = auth;
})

// User's profile controller.
.controller('UserProfileCtrl', function($scope, auth, UsersService, $state, store) {
  $scope.auth = auth;
  // Retrieves the logged user's identity
  function refreshUsers() {
    // Loading spinner starts
    $scope.loading = true;
    // getUser gets the user array of the authenticated user
    UsersService.getUser(auth.profile.identities[0].user_id)
    .then(function(data) {
      // Current authenticated used data object
      $scope.user = data;
      // Displaying in console the user's id
      console.log('user: ' + $scope.user.id);
    })
    .finally(function(){
      // Stops the loading spinner
      $scope.loading = false;
    });
  }
  // Execute the previous function
  refreshUsers();
  // Logout function
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    //$window.location.reload(true);
    //console.log(auth.isAuthenticated);
    $state.go('app.login');
    // refreshCourses();
  };
})

.controller('OwnCoursesCtrl', function($scope, auth, UserCoursesService, UsersService, CoursesService){
  $scope.auth = auth;

  function refreshUserCourses() {
    // For spinner's loading control
    $scope.loading = true;
    // getUser gets the user array of the authenticated user
    UsersService.getUser(auth.profile.identities[0].user_id)
    .then(function(data) {
      $scope.user = data;
      // List the courses owned by the authenticated user
      UserCoursesService.listUserCourses($scope.user.id)
      .then(function(data) {
        userCoursesTable = data;
        userCourseIds = [];
        $scope.userCourses = [];
        for (var i = 0; i < userCoursesTable.length; i++) {
          userCourseIds[i] = userCoursesTable[i].id_curso;
        }
        // Sorts the Course IDs array
        userCourseIds = userCourseIds.sort();
        CoursesService.list().then(function(data) {
          courses = data;
          // Sorts the courses by course id
          courses = courses.sort(function (a,b) {
            return a.id_curso - b.id_curso;
          });
          // Sorts the courses by course id
          userCoursesTable = userCoursesTable.sort(function (a,b) {
            return a.id_curso - b.id_curso;
          });
          // Loop that adds the course to the user
          for (var i = 0; i < userCoursesTable.length; i++) {
            if (courses[i].id_curso === userCourseIds[i]) {
              $scope.userCourses[i] = courses[i];
              // This field is for tracking the type of user (teacher, student)
              $scope.userCourses[i]['tipo_relacion'] = userCoursesTable[i].tipo_relacion;
            }
          }
        })
      })

    }).finally(function() {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
  }
  // Retrieves the logged user's courses
  refreshUserCourses();
})
// Courses controller - General View
.controller('CoursesCtrl', function($scope, CoursesService, auth, $state, UserCoursesService, $ionicHistory) {
  // This scope is used for conditional items (relationed with authentication) in the view
  $scope.auth = auth;

  function refreshCourses() {
    // For spinner's loading control
    $scope.loading = true;
    // CoursesService.list() lists all the courses from the backend
    CoursesService.list().then(function(data) {
      // The courses are stored in $scope.courses
      $scope.courses = data;
      console.log($scope.courses);
    }).finally(function() {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
    return $scope.courses;
  }
  refreshCourses();

})
// Course Detail controller, for individual course view
.controller('CourseDetailCtrl', function($scope, $stateParams, $state, auth,
  CoursesService, UsersService, UserCoursesService, $rootScope, $ionicHistory) {

    CoursesService.get($stateParams.courseId).then(function(data) {
      $scope.course = data;
      // getUser gets the user array of the authenticated user
      UsersService.getUser(auth.profile.identities[0].user_id)
      .then(function(data) {
        // Loading spinner starts
        $scope.loading = true;
        // user object is stored in $scope.user
        $scope.user = data;
        // With this function, we verify if the authenticated user is registered in the
        // selected course
        function verifyOwnCourse() {
          UserCoursesService.listUserCourses($scope.user.id)
          .then(function(data) {
            userCoursesTable = data;
            userCourseIds = [];
            $scope.ownCourse = false;
            for (var i = 0; i < userCoursesTable.length; i++) {
              userCourseIds[i] = userCoursesTable[i].id_curso;
              if ($stateParams.courseId == userCourseIds[i]) {
                // If the user is registered in the selected course, $scope.ownCourse
                // is set to true. We use this in the view for validate if the button
                // for registration to the course appers or the button for the view of
                // course contents
                $scope.ownCourse = true;
              }
            }
          })
        }

        verifyOwnCourse();
        // This object stores the user_id and course_id for the registration of the user in
        // the selected course.
        userCourseData = {
          user_id: $scope.user.id,
          course_id: $scope.course.id_curso
        };

        $scope.save = function() {
          UserCoursesService.createUserCourse(userCourseData)
          .then(function() {
            $state.go('app.own-courses');
          });
        };

      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });

    });

    function refreshTemarios() {

      // For spinner's loading control
      $scope.loading = true;
      // listCourseTemarios retrieves the topics (title and content)
      // information for the selected course
      CoursesService.listCourseTemarios($stateParams.courseId)
      .then(function(data) {
        // Array with temarios of the selected course
        $scope.temarios = data;
        $scope.courseTemarios = [];
        for (var i = 0; i < $scope.temarios.length; i++) {
          // Filling the courseTemarios array with the relevant data (title and content)
          $scope.courseTemarios[i] = {
            title: $scope.temarios[i].titulo,
            content: $scope.temarios[i].contenido
          };
        }

      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
    }
    refreshTemarios();

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

  .controller('ClassesCtrl', function($scope, ClassesService, auth, $stateParams) {

    $scope.auth = auth;

    function refreshClasses() {
      // For spinner's loading control
      $scope.loading = true;
      ClassesService.list($stateParams.courseId).then(function(data) {
        $scope.classes = data;
        $scope.classes = $scope.classes.sort(function (a,b) {
          return a.semana - b.semana;
        });
        //console.log($scope.classes);
        $scope.courseClasses = [];
        classNames = [];
        id = [];
        weekIndex = 1;
        for (var i = 0; i < $scope.classes.length; i++) {
          if ($scope.classes[i].semana == weekIndex) {
            classNames.push($scope.classes[i].nombre);
            id.push($scope.classes[i].id_leccion);
            $scope.courseClasses[i] = {
              id: id,
              week: weekIndex,
              classNames: classNames
            }
          } else if ($scope.classes[i].semana == (weekIndex + 1)) {
            weekIndex ++;
            classNames = new Array();
            id = new Array();
            classNames.push($scope.classes[i].nombre);
            id.push($scope.classes[i].id_leccion);
            $scope.courseClasses[i] = {
              id: id,
              week: weekIndex,
              classNames: classNames
            };
          }
          //console.log($scope.courseClasses[i].id);
          //$scope.courseClasses[i].clasNames[i];
        }
        console.log($scope.courseClasses[1].id);
        console.log($scope.courseClasses[2].id);
        //console.log($scope.courseClasses);
      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
      return $scope.courseClasses;
    }
    refreshClasses();

    $scope.toggleGroup = function(week) {
      if ($scope.isGroupShown(week)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = week;
      }
    };
    $scope.isGroupShown = function(week) {
      return $scope.shownGroup === week;
    };
  })

  .controller('TestsCtrl', function($scope, TestsService, auth, $stateParams, $ionicHistory) {

    function refreshTests() {
      courseId = $ionicHistory.backView().stateParams.courseId;
      // For spinner's loading control
      $scope.loading = true;
      TestsService.list(courseId).then(function(data) {
        $scope.tests = data;
        $scope.tests = $scope.tests.sort(function (a,b) {
          return a.semana - b.semana;
        });
        //console.log($scope.tests);
        $scope.courseTests = [];
        testNames = [];
        id = [];
        weekIndex = 1;
        for (var i = 0; i < $scope.tests.length; i++) {
          if ($scope.tests[i].semana == weekIndex) {
            testNames.push($scope.tests[i].nombre);
            id.push($scope.tests[i].id_evaluacion);
            $scope.courseTests[i] = {
              id: id,
              week: weekIndex,
              testNames: testNames
            }
          } else if ($scope.tests[i].semana == (weekIndex + 1)) {
            weekIndex ++;
            testNames = new Array();
            id = new Array();
            testNames.push($scope.tests[i].nombre);
            id.push($scope.tests[i].id_evaluacion);
            $scope.courseTests[i] = {
              id: id,
              week: weekIndex,
              testNames: testNames
            };
          }
          console.log($scope.courseTests[i].id);
          $scope.courseTests[i].nombre;
        }
        console.log($scope.courseTests[1].id);
        console.log($scope.courseTests[2].id);
        //console.log($scope.courseClasses);
      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
      return $scope.courseTests;
    }
    refreshTests();

    console.log('course_id (backView): ' + courseId);

    $scope.toggleGroup = function(week) {
      if ($scope.isGroupShown(week)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = week;
      }
    };
    $scope.isGroupShown = function(week) {
      return $scope.shownGroup === week;
    };
  })

  .controller('ClassDetailCtrl', function($scope, $stateParams, ClassesService, $sce) {

    function refreshClass() {
      // Loading spinner starts
      $scope.loading = true;
      ClassesService.get($stateParams.classId).then(function(data) {
        $scope.class = data;
        console.log($stateParams.classId);
        $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("560", "330");
        $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("420", "330");
        $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("315", "280");
        //console.log($scope.class.contenido_grafico);
      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
    }

    $scope.getTrustedHTML = function(str){
      return $sce.trustAsHtml(str);
    }

    refreshClass();
  })

  .controller('TestDetailCtrl', function($scope, $stateParams, TestsService) {

    function refreshTest() {
      TestsService.get($stateParams.testId).then(function(data) {
        $scope.test = data;
        console.log($scope.test);
      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
    }
    refreshTest();

    function refrestQuestions() {
      // Loading spinner starts
      $scope.loading = true;
      TestsService.listQuestions($stateParams.testId).then(function(data){
        $scope.questions = data;
        console.log('questions by testId ' + $stateParams.testId + ': ' + $scope.questions);

        function isMultiple() {
          $scope.multiple = false;
          $scope.multiple_questions = [];
          for (var i = 0;  i < $scope.questions.length; i++) {
            if ($scope.questions[i].opcion_multiple == 'si') {
              $scope.multiple = true;
              $scope.multiple_questions[i] = {
                id: $scope.questions[i].id_pregunta,
                question: $scope.questions[i].nombre,
                a: $scope.questions[i].opcion_a,
                b: $scope.questions[i].opcion_b,
                c: $scope.questions[i].opcion_c,
                d: $scope.questions[i].opcion_d
              };
              console.log('question: ' + $scope.multiple_questions[i].question);
              console.log('a: ' + $scope.multiple_questions[i].a);
            }
          }
        }

        isMultiple();

      }).finally(function() {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
    }

    refrestQuestions();

  })

  .controller('LoginCtrl', function($scope, auth, $state, store) {

    function doAuth() {
      auth.signin({
        closable: false,
        // This asks for the refresh token
        // So that the user never has to log in again
        authParams: {
          scope: 'openid offline_access'
        }
      }, function(profile, idToken, accessToken, state, refreshToken) {
        //$scope.isAuthenticated = auth.isAuthenticated;
        store.set('profile', profile);
        store.set('token', idToken);
        store.set('refreshToken', refreshToken);
        $state.go('app.login');
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
