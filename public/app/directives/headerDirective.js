/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Directives')
        .directive('shHeader', headerDirective);

    headerDirective.$inject = ['$location', 'accountService'];

    /**
     * Header Directive
     * */
    function headerDirective ($location, accountService) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/headerView.html',
            link: link,
            replace: true
        };

        /**
         * Link function
         * */
        function link ($scope) {
            $scope.userInfo = accountService.getUserInfo();
            $scope.ln = accountService.getLocalization;
            $scope.path = $location.path().substr(1).split('#')[0];

            console.log($scope.path);
            $scope.doNothing = function ($event) {
                $event.preventDefault();
            };

            $scope.logout = function () {
                accountService.logout();
                $location.path('/user/log-in');
            };

            if (Object.keys($scope.userInfo).length === 0) {
                accountService.loadUserInfo()
                    .then(function () {
                        $scope.userInfo = accountService.getUserInfo();
                    });
            }

        }
    }
})();
