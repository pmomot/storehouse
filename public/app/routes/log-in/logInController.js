/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('LogInController', LogInController);

    LogInController.$inject = ['$location', 'accountService'];

    /**
     * User Log In Controller
     * */
    function LogInController ($location, accountService) {
        var vm = this;

        vm.errors = [];
        vm.data = {};
        vm.sendRequest = sendRequest;

        /**
         * Send user log in request
         * */
        function sendRequest () {
            vm.errors = [];

            accountService.login(vm.data.email, vm.data.password)
                .then(function () {
                    vm.errors = [];
                    $location.path('/');
                }
            );
        }
    }

})();
