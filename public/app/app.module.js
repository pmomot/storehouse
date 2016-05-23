/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {
    var underscore = angular.module('underscore', []),
        runArray;

    runArray = ['$rootScope', '$location', '$window', 'accountService', 'productService', '$anchorScroll', runFunction];

    underscore.factory('_', ['$window', function ($window) {
        return $window._;
    }]);

    angular.module('StoreHouse',
        [
            'ngRoute',
            'ngMessages',
            'toastr',
            'underscore',
            'StoreHouse.Services',
            'StoreHouse.Repositories',
            'StoreHouse.Directives',
            'StoreHouse.Constants'
        ])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
        })
        .config(function (toastrConfig) {
            angular.extend(toastrConfig, {
                maxOpened: 5,
                newestOnTop: true,
                preventDuplicates: false,
                preventOpenDuplicates: true,
                allowHtml: true,
                timeOut: 3000
            });
        })
        .run(runArray);

    /**
     * Function that executes on module run
     * @param {Object} $rootScope - angular built in, root scope
     * @param {Object} $location - angular built in service, browser location info
     * @param {Object} $window - angular built in, window object
     * @param {Object} accountService - account operations service
     * */
    function runFunction ($rootScope, $location, $window, accountService) {

        // prevent loading any session required page without necessary token
        $rootScope.$on('$routeChangeStart', function (event, next) {
            if ($window.localStorage.getItem('token') === '') {
                accountService.fetchLocale();

                if (next.templateUrl !== 'app/routes/log-in/logInView.html' &&
                    next.templateUrl !== 'app/routes/sign-up/signUpView.html' &&
                    next.templateUrl !== 'app/routes/forgot-password/IForgotView.html') {

                    $location.path('/user/log-in');
                }
            } else if (!accountService.hasUserInfo()) {
                accountService.loadUserInfo();
            }
        });
    }

    angular.module('StoreHouse.Services', []);
    angular.module('StoreHouse.Repositories', []);
    angular.module('StoreHouse.Directives', []);
    angular.module('StoreHouse.Constants', []);

})();
