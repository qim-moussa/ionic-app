// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var nameApp = angular.module('starter', ['ionic']);

nameApp.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
    .state('list', {
      url: '/',
      templateUrl: 'list.html',
      controller: 'ListCtrl'
    })
    .state('view', {
      url: '/movie/:movieid',
      templateUrl: 'view.html',
      controller: 'ViewCtrl'
    });
 
  $urlRouterProvider.otherwise("/");
 
});

nameApp.factory('Movies', function($http,$log) {
  var cachedData;
 
  function getData(moviename, callback) {
 
    /*var url = 'http://api.themoviedb.org/3/',
      mode = 'search/movie?query=',
      name = '&query=' + encodeURI(moviename),
      key = '&api_key=5fbddf6b517048e25bc3ac1bbeafb919';
      $http.get(url + mode + key + name).success */

    var url = 'http://192.168.1.34:8080/movie-app-backend-1.0-SNAPSHOT/movie?search=',
    queryMovie = encodeURI(moviename);
 
    $http.get(url + queryMovie).success(function(data) {
      cachedData = data;
      callback(cachedData);
    });
  }
 
  return {
    list: getData,
    find: function(name, callback) {
      console.log(cachedData);
      var movie = cachedData.filter(function(entry) {
        return entry.id == name;
      })[0];
      callback(movie);
    }
  };
 
});
 
nameApp.controller('ListCtrl', function($scope, $http, Movies) {
 
  $scope.movie = {
    name: 'Batman'
  }
 
  $scope.searchMovieDB = function() {
 
    Movies.list($scope.movie.name, function(movies) {
      $scope.movies = movies;
    });
     
  };
  
  $scope.searchMovieDB();
  
});
 
nameApp.controller('ViewCtrl', function($scope, $http, $stateParams, Movies) {
  Movies.find($stateParams.movieid, function(movie) {
    $scope.movie = movie;
  });
});

nameApp.directive('holdList', ['$ionicGesture', function ($ionicGesture) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $ionicGesture.on('hold', function (e) {

                var content = element[0].querySelector('.item-content');

                var buttons = element[0].querySelector('.item-options');
                var buttonsWidth = buttons.offsetWidth;

                ionic.requestAnimationFrame(function() {
					content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

					if (!buttons.classList.contains('invisible')) {
						content.style[ionic.CSS.TRANSFORM] = '';
						setTimeout(function() {
							buttons.classList.add('invisible');
						}, 250);				
					} else {
						buttons.classList.remove('invisible');
						content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
					}
				});


            }, element);
        }
    };
} ]);
