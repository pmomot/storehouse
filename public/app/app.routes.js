/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .config(routeHandler);

    routeHandler.$inject = ['$routeProvider'];

    /**
     * All app routes
     * */
    function routeHandler ($routeProvider) {

        $routeProvider
            .when('/user/sign-up', {
                templateUrl: 'app/routes/sign-up/signUpView.html',
                controller: 'SignUpController',
                controllerAs: 'vm'
            })
            .when('/user/log-in', {
                templateUrl: 'app/routes/log-in/logInView.html',
                controller: 'LogInController',
                controllerAs: 'vm'
            })
            .when('/user/change-pass', {
                templateUrl: 'app/routes/change-pass/changePassView.html',
                controller: 'ChangePassController',
                controllerAs: 'vm'
            })
            //.when('/claims/:claimType', {
            //    templateUrl: 'js/routes/claims/claimsView.html',
            //    controller: 'ClaimsController',
            //    controllerAs: 'vm'
            //})
            .otherwise({
                redirectTo: '/'
            });
    }
})();
