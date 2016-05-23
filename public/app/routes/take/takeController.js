/**
 * Created by pmomot on 5/4/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('TakeController', TakeController);

    TakeController.$inject = ['accountService', 'productService'];

    /**
     * Take product from storehouse Controller
     * */
    function TakeController (accountService, productService) {
        var vm = this;

        vm.ln = accountService.getLocalization;

        vm.processingRequest = false;
        vm.foundList = productService.getLastSearch;
        vm.searchValue = '';
        vm.searchSubmit = searchSubmit;
        vm.takeSubmit = takeSubmit;

        /**
         * Search form submit callback
         * */
        function searchSubmit () {
            vm.processingRequest = true;

            productService
                .search(vm.searchValue)
                .finally(function () {
                    vm.processingRequest = false;
                });
        }

        /**
         * Take form submit callback
         * @param {Object} p - product to take
         * */
        function takeSubmit (p) {
            var ajaxParams = {
                uuid: p.uuid,
                takeAmount: p.takeAmount,
                reason: p.reason
            };

            vm.processingRequest = true;

            productService
                .take(ajaxParams)
                .then(function () {
                    p.takeAmount = '';
                    p.reason = '';
                })
                .finally(function () {
                    vm.processingRequest = false;
                });
        }

    }

})();
