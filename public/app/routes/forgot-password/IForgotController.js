/**
 * Created by bodynP on 4/3/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('IForgotController', IForgotController);

    IForgotController.$inject = ['$location', 'accountService'];

    /**
     * User Log In Controller
     * */
    function IForgotController ($location, accountService) {
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