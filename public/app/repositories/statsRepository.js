/**
 * Created by pmomot on 5/11/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Repositories')
        .factory('statsRepository', statsRepository);

    statsRepository.$inject = ['$http', '$q'];

    /**
     * Statistics Repository
     * */
    function statsRepository ($http, $q) {

        /**
         * Get general statistics for storehouse
         * */
        function fetchGeneral () {
            var deferred = $q.defer();

            $http.get('/api/stats/general')
                .then(function (result) {
                    if (result.data.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.data);
                    }
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        return {
            fetchGeneral: fetchGeneral
        };
    }

})();
