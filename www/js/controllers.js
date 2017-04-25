'use strict';

angular.module('mooc.controllers', ['ngSanitize']).controller('AppCtrl', function () {}).controller('MenuCtrl', function ($scope, auth, $rootScope) {
  // This scope is used for conditional menu items (relationed with authentication)
  $scope.auth = auth;
})

// User's profile controller.
.controller('UserProfileCtrl', function ($scope, auth, UsersService, $state, store) {
  _.assign($scope, { auth: auth });
  // Retrieves the logged user's identity
  function refreshUsers() {
    // Loading spinner starts
    $scope.loading = true;
    // getUser gets the user array of the authenticated user
    UsersService.getUser(auth.profile.identities[0].user_id).then(function (data) {
      // Current authenticated used data object
      var user = data;
      _.assign($scope, { user: user });
      // Displaying in console the user's id
      console.log('user: ' + $scope.user.id);
    }).finally(function () {
      // Stops the loading spinner
      var loading = false;
      _.assign($scope, { loading: loading });
    });
  }
  // Execute the previous function
  refreshUsers();
  // Logout function
  $scope.logout = function () {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    //$window.location.reload(true);
    //console.log(auth.isAuthenticated);
    $state.go('app.login');
    // refreshCourses();
  };
}).controller('OwnCoursesCtrl', function ($scope, auth, UserCoursesService, UsersService, CoursesService) {
  $scope.auth = auth;

  function refreshUserCourses() {
    var userCourseIds = [];
    $scope.userCourses = [];
    // For spinner's loading control
    $scope.loading = true;
    // getUser gets the user array of the authenticated user
    UsersService.getUser(auth.profile.identities[0].user_id).then(function (data) {
      var userId = data.id;
      // List the courses owned by the authenticated user
      UserCoursesService.listUserCourses(userId).then(function (data) {
        var userCoursesTable = data;
        $scope.userCourses = [];
        for (var i = 0; i < userCoursesTable.length; i++) {
          userCourseIds[i] = userCoursesTable[i].id_curso;
        }
        // Sorts the Course IDs array
        var sortedUserCourseIds = userCourseIds.sort();
        CoursesService.list().then(function (data) {
          // Sorts the courses by course id
          var courses = _.sortBy(data, function (course) {
            return course.id_curso;
          });
          // Sorts the courses by course id
          var sortedUserCoursesTable = _.sortBy(userCoursesTable, function (userCourse) {
            return userCourse.id_curso;
          });
          // Loop that adds the course to the user
          for (var _i = 0; _i < sortedUserCoursesTable.length; _i++) {
            if (courses[_i].id_curso === sortedUserCourseIds[_i]) {
              $scope.userCourses[_i] = courses[_i];
              // This field is for tracking the type of user (teacher, student)
              $scope.userCourses[_i]['tipo_relacion'] = sortedUserCoursesTable[_i].tipo_relacion;
            }
          }
        });
      });
    }).finally(function () {
      // after request is done, spinner will disappear
      var loading = false;
      _.assign($scope, { loading: loading });
    });
  }
  // Retrieves the logged user's courses
  refreshUserCourses();
})
// Courses controller - General View
.controller('CoursesCtrl', function ($scope, CoursesService, $state, UserCoursesService, $ionicHistory) {
  // This scope is used for conditional items (relationed with authentication) in the view

  function refreshCourses() {
    // For spinner's loading control
    var loading = true;
    _.assign($scope, { loading: loading });
    // CoursesService.list() lists all the courses from the backend
    CoursesService.list().then(function (data) {
      // The courses are stored in $scope.courses
      var courses = data;
      _.assign($scope, { courses: courses });
    }).finally(function () {
      // after request is done, spinner will disappear
      var loading = false;
      _.assign($scope, { loading: loading });
    });
    return $scope.courses;
  }
  refreshCourses();
})
// Course Detail controller, for individual course view
.controller('CourseDetailCtrl', function ($scope, $stateParams, $state, auth, CoursesService, UsersService, UserCoursesService, $rootScope, $ionicHistory) {

  CoursesService.get($stateParams.courseId).then(function (data) {
    var userCoursesTable = [];
    var userCourseIds = [];
    $scope.course = data;
    // getUser gets the user array of the authenticated user
    if (auth.isAuthenticated) {
      UsersService.getUser(_.get(auth, 'profile.identities[0].user_id')).then(function (data) {
        // Loading spinner starts
        $scope.loading = true;
        // user object is stored in $scope.user
        $scope.user = data;
        // With this function, we verify if the authenticated user is registered in the
        // selected course
        function verifyOwnCourse() {
          UserCoursesService.listUserCourses($scope.user.id).then(function (data) {
            userCoursesTable = data;
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
          });
        }

        verifyOwnCourse();
        // This object stores the user_id and course_id for the registration of the user in
        // the selected course.
        var userCourseData = {
          user_id: $scope.user.id,
          course_id: $scope.course.id_curso
        };

        $scope.save = function () {
          UserCoursesService.createUserCourse(userCourseData).then(function () {
            $state.go('app.own-courses');
          });
        };
      }).finally(function () {
        // after request is done, spinner will disappear
        $scope.loading = false;
      });
    }
  });

  ///

  function refreshTemarios() {

    // For spinner's loading control
    $scope.loading = true;
    // listCourseTemarios retrieves the topics (title and content)
    // information for the selected course
    CoursesService.listCourseTemarios($stateParams.courseId).then(function (data) {
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
    }).finally(function () {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
  }
  refreshTemarios();

  /*
  * if given group is the selected group, deselect it
  * else, select the given group
  */
  $scope.toggleGroup = function (title) {
    if ($scope.isGroupShown(title)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = title;
    }
  };
  $scope.isGroupShown = function (title) {
    return $scope.shownGroup === title;
  };
}).controller('ClassesCtrl', function ($scope, ClassesService, auth, $stateParams) {

  $scope.auth = auth;

  function refreshClasses() {
    var classNames = [];
    var id = [];
    // For spinner's loading control
    $scope.loading = true;
    // Lists the classes of the course selected
    ClassesService.list($stateParams.courseId).then(function (data) {
      $scope.classes = data;
      // Saves the classes sorted by id in $scope.classes
      $scope.classes = $scope.classes.sort(function (a, b) {
        return a.semana - b.semana;
      });
      $scope.courseClasses = [];
      var weekIndex = 1;
      // Loop for filling the id, classNames and week in the courseClasses array
      for (var i = 0; i < $scope.classes.length; i++) {
        // if week index (FK) at classes is equal to weekIndex, it executes the code below
        if ($scope.classes[i].semana == weekIndex) {
          classNames.push($scope.classes[i].nombre);
          id.push($scope.classes[i].id_leccion);
          $scope.courseClasses[i] = {
            id: id,
            week: weekIndex,
            classNames: classNames
          };
        }
        // If week index (FK) changes to semana + 1, and it's equal to weekIndex + 1
        // it executes the code below. This is important because every time that change the
        // index for week (for example, we want to see the content/classes for the next week/module)
        // it will create a new array for week and classNames.
        else if ($scope.classes[i].semana == weekIndex + 1) {
            weekIndex++;
            classNames = [];
            id = [];
            // Pushes the className for classes[i]
            classNames.push($scope.classes[i].nombre);
            // Pushes the id (week index) for classes[i]
            id.push($scope.classes[i].id_leccion);
            $scope.courseClasses[i] = {
              id: id,
              week: weekIndex,
              classNames: classNames
            };
          }
      }
    }).finally(function () {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
    return $scope.courseClasses;
  }
  refreshClasses();

  $scope.toggleGroup = function (week) {
    if ($scope.isGroupShown(week)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = week;
    }
  };
  $scope.isGroupShown = function (week) {
    return $scope.shownGroup === week;
  };
})
// Tests Controller
.controller('TestsCtrl', function ($scope, TestsService, auth, $stateParams, $ionicHistory) {

  function refreshTests() {
    // courseID param, stored in the back view
    var courseId = $ionicHistory.backView().stateParams.courseId;
    // For spinner's loading control
    $scope.loading = true;
    // List the tests for the course and class selected
    TestsService.list(courseId).then(function (data) {
      $scope.tests = data;
      $scope.tests = _.sortBy($scope.tests, function (test) {
        return test.semana;
      });
      $scope.courseTests = [];
      var testNames = [];
      var id = [];
      var weekIndex = 1;
      for (var i = 0; i < $scope.tests.length; i++) {
        if ($scope.tests[i].semana == weekIndex) {
          testNames.push(_.get($scope, 'tests[i].nombre'));
          id.push(_.get($scope, 'tests[i].id_evaluacion'));
          $scope.courseTests[i] = {
            id: id,
            week: weekIndex,
            testNames: testNames
          };
        } else if ($scope.tests[i].semana == weekIndex + 1) {
          weekIndex++;
          testNames = [];
          id = [];
          testNames.push($scope.tests[i].nombre);
          id.push($scope.tests[i].id_evaluacion);
          $scope.courseTests[i] = {
            id: id,
            week: weekIndex,
            testNames: testNames
          };
        }
        $scope.courseTests[i].nombre;
      }
    }).finally(function () {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
    return $scope.courseTests;

    console.log('course_id (backView): ' + courseId);
  }
  refreshTests();

  $scope.toggleGroup = function (week) {
    if ($scope.isGroupShown(week)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = week;
    }
  };
  $scope.isGroupShown = function (week) {
    return $scope.shownGroup === week;
  };
})
//
.controller('TestDetailCtrl', function ($scope, $stateParams, TestsService, $ionicPopup, $ionicHistory, auth, UsersService, DateService) {

  var courseId = $ionicHistory.backView().stateParams.courseId;

  $scope.data = {};
  $scope.data2 = {};
  var testId = $stateParams.testId;
  var userId = 0;

  function refreshTest() {
    TestsService.get(testId).then(function (data) {
      $scope.test = data;
      console.log($scope.test);
    }).finally(function () {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
  }
  refreshTest();

  function refrestQuestions() {
    // Loading spinner starts
    $scope.loading = true;
    TestsService.listQuestions(testId).then(function (data) {

      var questions = _.sortBy(data, function (question) {
        return question.id_pregunta;
      });

      console.log('questions by testId ' + testId + ': ' + questions);

      function isMultiple() {

        $scope.multiple = false;
        $scope.single = false;
        $scope.single_questions = [];
        $scope.multiple_questions = [];
        var j = 0;
        var k = 0;
        for (var i = 0; i < questions.length; i++) {
          if (questions[i].opcion_multiple == 'si') {
            $scope.multiple = true;
            $scope.multiple_questions[j] = {
              id: questions[i].id_pregunta,
              questionText: questions[i].nombre,
              options: [questions[i].opcion_a, questions[i].opcion_b, questions[i].opcion_c, questions[i].opcion_d],
              option_value: ['a', 'b', 'c', 'd'],
              answer: questions[i].respuesta
            };
            console.log('answer: ', $scope.multiple_questions[j].answer);
            console.log('picked: ', $scope.data);
            j++;
          } else {
            $scope.single = true;
            $scope.single_questions[k] = {
              id: questions[i].id_pregunta,
              questionText: questions[i].nombre,
              answer: questions[i].respuesta
            };
            console.log('single question: ', $scope.single_questions[k].questionText);
            console.log('single q answer: ', $scope.single_questions[k].answer);
            k++;
          }
        }

        // if (single_questions.length > 0) { $scope.single = true }

        var multipleQuestionsLength = $scope.multiple_questions.length;
        var singleQuestionsLength = $scope.single_questions.length;
        var questionsLength = questions.length;

        $scope.submit = function () {
          var hits = 0;
          if (Object.keys($scope.data).length == multipleQuestionsLength && Object.keys($scope.data2).length == singleQuestionsLength) {
            console.log($scope.data);
            for (var _i2 = 0; _i2 < multipleQuestionsLength; _i2++) {
              console.log('multiple q length: ' + multipleQuestionsLength);
              if ($scope.multiple_questions[_i2].answer === $scope.data[_i2]) {
                hits++;
              }
            }
            console.log($scope.data2);
            for (var _i3 = 0; _i3 < singleQuestionsLength; _i3++) {
              console.log('single q length: ' + singleQuestionsLength);
              console.log('data2[i]: ' + $scope.data2[_i3]);
              if ($scope.single_questions[_i3].answer === $scope.data2[_i3]) {
                hits++;
              }
            }
            console.log('asiertos: ' + hits);
            var gradeFloat = (hits / questionsLength * 100).toFixed(2);
            var grade = Math.floor(gradeFloat);

            var alertPopup = $ionicPopup.alert({
              title: 'Resultado del Quiz',
              template: 'Aciertos: ' + hits + '<br/>Nota: ' + grade + ' %'
            });

            UsersService.getUserId(auth.profile.identities[0].user_id).then(function (userData) {
              userId = userData;

              var testDataGet = {
                user_id: userId,
                test_id: testId
              };

              console.log(testDataGet);

              // let date = DateService.getDate();
              TestsService.getAttempts(testDataGet).then(function (attemptData) {
                var attempts = attemptData;

                var testData = {
                  test_id: testId,
                  user_id: userId,
                  grade: grade,
                  attempts: attempts,
                  course_id: courseId,
                  date: DateService.getDate()
                };

                console.log(testData);

                if (attempts === 0) {
                  attempts++;
                  testData.attempts = attempts;
                  TestsService.createAttempt(testData).then(function (createAttemptData) {
                    console.log('Attempt created');
                  });
                } else {
                  attempts++;
                  testData.attempts = attempts;
                  TestsService.updateAttempt(testData).then(function (updateAttemptData) {
                    console.log('Attempt updated');
                  });
                }

                $ionicHistory.goBack();
              });
            });
          } else {
            $ionicPopup.alert({
              title: '¡ Error !',
              template: 'Debes contestar todas las preguntas'
            });
          }
        };
      }

      isMultiple();
    }).finally(function () {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
  }

  refrestQuestions();
}).controller('ClassDetailCtrl', function ($scope, $stateParams, ClassesService, $sce) {

  function refreshClass() {
    // Loading spinner starts
    $scope.loading = true;
    ClassesService.get($stateParams.classId).then(function (data) {
      $scope.class = data;
      console.log($stateParams.classId);
      $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("560", "330");
      $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("420", "330");
      $scope.class.contenido_grafico = $scope.class.contenido_grafico.replace("315", "280");
    }).finally(function () {
      // after request is done, spinner will disappear
      $scope.loading = false;
    });
  }

  $scope.getTrustedHTML = function (str) {
    return $sce.trustAsHtml(str);
  };

  refreshClass();
})
// Login controller - it uses auth and store from auth0 library
.controller('LoginCtrl', function ($scope, auth, $state, store) {
  // Authentication function.
  function doAuth() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access'
      }
    }, function (profile, idToken, accessToken, state, refreshToken) {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('app.login');
    }, function (error) {
      console.log("There was an error logging in", error);
    });
  }

  $scope.$on('$ionic.reconnectScope', function () {
    doAuth();
  });

  doAuth();

  $scope.auth = auth;
});