/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('ChangePassController', ChangePassController);

    ChangePassController.$inject = ['$window', 'REGEX', 'accountService'];

    /**
     * Change User Password Controller
     * */
    function ChangePassController ($window, REGEX, accountService) {
        var vm = this;

        vm.errors = [];
        vm.data = {
            currentPassword: '',
            newPassword: '',
            repeatPassword: ''
        };
        vm.sendRequest = sendRequest;
        vm.goBack = goBack;
        vm.ln = accountService.getLocalization;

        /**
         * Send user change password request
         * */
        function sendRequest () {
            vm.errors = [];

            if ((vm.data.newPassword === vm.data.repeatPassword) && (vm.data.newPassword !== '') && (vm.data.repeatPassword !== '')) {
                if (!REGEX.PASS.test(vm.data.newPassword) || !REGEX.PASS.test(vm.data.repeatPassword)) {
                    vm.errors.push(vm.ln()['error-password-validation']);
                } else {
                    accountService.changePass({
                        currentPass: vm.data.currentPassword,
                        newPass: vm.data.newPassword
                    })
                        .then(function (data) {
                            vm.errors = [];

                            if (data.success) {
                                $window.history.back();
                            }
                        });
                }
            } else {
                vm.errors.push(vm.ln()['error-passwords-mismatch']);
            }
        }

        /**
         * Return to previous route
         * @param {Object} $event - event
         * */
        function goBack ($event) {
            $event.preventDefault();
            $window.history.back();
        }
    }
})();
