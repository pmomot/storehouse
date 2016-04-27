/**
 * Created by pmomot on 4/27/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('UserSettingsController', UserSettingsController);

    UserSettingsController.$inject = ['accountService'];

    /**
     * User Settings Controller
     * */
    function UserSettingsController (accountService) {
        var vm = this;

        // TODO SH finish development

        vm.ln = accountService.getLocalization;

    }

})();
