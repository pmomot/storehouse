/**
 * Created by pmomot on 5/11/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Services')
        .factory('statsService', statsService);

    statsService.$inject = ['$q', 'statsRepository'];

    /**
     * Statistics processing service
     * */
    function statsService ($q, statsRepository) {
        var generalStats = {
            money: 0,
            productsCount: 0
        };

        fetchGeneral();

        /**
         * Get general statistics for storehouse
         * */
        function fetchGeneral () {
            var deferred = $q.defer();

            statsRepository.fetchGeneral()
                .then(function (data) {
                    generalStats = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Get general stats
         * */
        function getGeneral () {
            return generalStats;
        }

        return {
            fetchGeneral: fetchGeneral,

            getGeneral: getGeneral
        };
    }
})();
