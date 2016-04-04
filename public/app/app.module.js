/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {
    angular.module('StoreHouse',
        [
            'ngRoute',
            'toastr',
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
        .run(['$rootScope', '$location', '$window', 'accountService', '$anchorScroll', function ($rootScope, $location, $window, accountService) {

            // prevent loading any session required page without necessary token
            $rootScope.$on('$routeChangeStart', function (event, next) {
                if ($window.localStorage.getItem('token') === '') {
                    if (next.templateUrl !== 'app/routes/log-in/logInView.html' &&
                        next.templateUrl !== 'app/routes/sign-up/signUpView.html' &&
                        next.templateUrl !== 'app/routes/forgot-password/forgotPass.html') {

                        $location.path('/user/log-in');
                    }
                } else if (!accountService.hasUserInfo()) {
                    accountService.loadUserInfo();
                }
            });
        }]);

    angular.module('StoreHouse.Services', []);
    angular.module('StoreHouse.Repositories', []);
    angular.module('StoreHouse.Directives', []);
    angular.module('StoreHouse.Constants', []);

})();
