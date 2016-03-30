/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Directives')
        .directive('clHeader', headerDirective);

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
            $scope.path = $location.path().substr(8).split('#')[0];

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
