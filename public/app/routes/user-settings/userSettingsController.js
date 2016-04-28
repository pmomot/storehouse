/**
 * Created by pmomot on 4/27/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('UserSettingsController', UserSettingsController);

    UserSettingsController.$inject = ['$scope', '$window', 'accountService'];

    /**
     * User Settings Controller
     * */
    function UserSettingsController ($scope, $window, accountService) {
        var vm = this;

        // TODO SH finish development

        vm.ln = accountService.getLocalization;
        vm.userInfo = accountService.getUserInfo;

        vm.processingLangRequest = false;

        $scope.$watch(function () {
            return vm.userInfo().lang;
        }, function (lang) {
            if (typeof lang === 'undefined' || lang === $window.localStorage.getItem('lang')) {
                return;
            }

            vm.processingLangRequest = true;
            accountService
                .changeLanguage(lang)
                .finally(removeProcessingBlock);
        });

        /**
         * Remove processing (disabled) state
         * */
        function removeProcessingBlock () {
            vm.processingLangRequest = false;
        }

    }

})();
