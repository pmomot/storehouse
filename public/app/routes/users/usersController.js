/**
 * Created by pmomot on 3/31/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['accountService'];

    /**
     * Users Controller
     * */
    function UsersController (accountService) {
        var vm = this;

        vm.users = accountService.getUsers;

        accountService.fetchUsers();
    }

})();
