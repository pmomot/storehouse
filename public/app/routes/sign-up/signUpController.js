/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('SignUpController', SignUpController);

    SignUpController.$inject = ['$location', '$window', 'REGEX', 'accountService'];

    /**
     * User Sign Up Controller
     * */
    function SignUpController ($location, $window, REGEX, accountService) {
        var vm = this;

        vm.errors = [];
        vm.data = {};
        vm.sendRequest = sendRequest;

        if ($window.localStorage.getItem('token')) { // sign up page can be opened only when not authorized
            $location.path('/');
        }

        /**
         * Send user sign up request
         * */
        function sendRequest () {

            vm.errors = [];

            if (!REGEX.NAME.test(vm.data.firstName)) {
                vm.errors.push('First name may contain only letters.');
            }
            if (!REGEX.NAME.test(vm.data.lastName)) {
                vm.errors.push('Last name may contain only letters.');
            }
            if (!REGEX.EMAIL.test(vm.data.email)) {
                vm.errors.push('Email is invalid.');
            }
            if (!REGEX.PASS.test(vm.data.password)) {
                vm.errors.push('Password must be at least 7 characters long and not contain spaces.');
            }
            if (vm.data.password !== vm.data.passwordConfirm) {
                vm.errors.push('Passwords do not match.');
            }

            if (vm.errors.length === 0) {
                vm.data.userGroup = 'users';

                accountService.signUp(vm.data)
                    .then(function () {
                        vm.errors = [];
                        $location.path('/user/log-in');
                    }
                );
            }

        }

    }


})();
