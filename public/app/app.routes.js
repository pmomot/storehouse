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
            .when('/user/settings', {
                templateUrl: 'app/routes/user-settings/userSettingsView.html',
                controller: 'UserSettingsController',
                controllerAs: 'vm'
            })
            .when('/users', {
                templateUrl: 'app/routes/users/usersView.html',
                controller: 'UsersController',
                controllerAs: 'vm'
            })
            .when('/forgot-password', {
                templateUrl: 'app/routes/forgot-password/IForgotView.html',
                controller: 'IForgotController',
                controllerAs: 'vm'
            })
            
            .when('/products', {
                templateUrl: 'app/routes/products/productsView.html',
                controller: 'ProductsController',
                controllerAs: 'vm'
            })
            .when('/products/units', {
                templateUrl: 'app/routes/units/unitsView.html',
                controller: 'UnitsController',
                controllerAs: 'vm'
            })
            .when('/products/groups', {
                templateUrl: 'app/routes/product-groups/productGroupsView.html',
                controller: 'ProductGroupsController',
                controllerAs: 'vm'
            })
            .when('/products/take', {
                templateUrl: 'app/routes/take/takeView.html',
                controller: 'TakeController',
                controllerAs: 'vm'
            })
            .when('/stats/:type', {
                templateUrl: 'app/routes/stats/statsView.html',
                controller: 'StatisticsController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/products'
            });
    }
})();
