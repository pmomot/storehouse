/**
 * Created by pmomot on 5/11/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('StatisticsController', StatisticsController);

    StatisticsController.$inject = ['$routeParams', 'accountService', 'statsService'];

    /**
     * Statistics Controller
     * */
    function StatisticsController ($routeParams, accountService, statsService) {
        var vm = this;

        vm.type = $routeParams.type;
        vm.ln = accountService.getLocalization;
        vm.general = statsService.getGeneral;

        vm.refreshStats = refreshStats;

        /**
         * Send request to refresh statistics
         * */
        function refreshStats () {
            switch ($routeParams.type) {
                case 'all':
                    break;
                case 'general':
                    statsService.fetchGeneral();
                    break;
            }
        }

    }

})();
