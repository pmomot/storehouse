/**
 * Created by pmomot on 5/9/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Directives')
        .directive('shLn', lnDirective);

    lnDirective.$inject = ['$window', 'accountService'];

    /**
     * Localization Directive
     * */
    function lnDirective ($window, accountService) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/lnView.html',
            link: link,
            replace: true,
            scope: {
                small: '='
            }
        };

        /**
         * Link function
         * */
        function link ($scope) {
            $scope.ln = accountService.getLocalization;
            $scope.userInfo = accountService.getUserInfo;

            console.log($scope.small);

            $scope.selectLanguage = selectLanguage;

            $scope.processingRequest = false;

            $scope.$watch(function () {
                return $scope.userInfo().lang;
            }, function (lang) {
                $scope.language = lang;
            });

            /**
             * Select different language from drop-down menu
             * @param {Object} $event - js click event
             * @param {String} lang - language code
             * */
            function selectLanguage ($event, lang) {
                $event.preventDefault();

                $scope.language = lang;

                if (typeof $scope.language === 'undefined' ||
                    $scope.language === $window.localStorage.getItem('lang')) {
                    return;
                }

                $scope.processingRequest = true;

                if (typeof $scope.userInfo().fullName === 'undefined') { // unauthorized user
                    window.localStorage.setItem('lang', $scope.language);

                    accountService
                        .fetchLocale()
                        .finally(function () {
                            $scope.processingRequest = false;
                        });
                } else { // authorized user
                    accountService
                        .changeLanguage($scope.language)
                        .finally(function () {
                            $scope.processingRequest = false;
                        });
                }
            }
        }
    }
})();
