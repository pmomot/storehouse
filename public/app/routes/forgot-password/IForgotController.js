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
     * User forgot Controller
     * */
    function IForgotController ($location, accountService) {
        var vm = this;
        
        vm.data = {};
        vm.sendRequest = sendRequest;
        
        /**
         * submit function send mail data from input
         * */
        function sendRequest () {
            accountService.restorePassword(vm.data)
                
                .then(function () {
                    $location.path('/');
                }
            );
        }
    }

})();