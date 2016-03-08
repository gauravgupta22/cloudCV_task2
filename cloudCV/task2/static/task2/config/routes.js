'use strict';

// Setting up route
angular.module('task2').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
        state('page1', {
            url: '/',
            templateUrl: 'static/task2/views/g1.html'
        });
        
    }
]);