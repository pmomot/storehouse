/**
 * Created by pahlavaUbivca on 4/3/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('ForgotController', ForgotController);

    ForgotController.$inject = ['$location', 'accountService'];

    /**
     * User Log In Controller
     * */
    function ForgotController ($location, accountService) {
        var vm = this;

      /*  vm.data = {};
        vm.sendRequest = sendRequest;

        /!**
         * Send user log in request
         * *!/
        function sendRequest() {
            accountService.login(vm.data.email, vm.data.password)
                .then(function () {
                    $location.path('/');
                }
            );
        }*/
    }

})();